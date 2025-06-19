const { ethers } = require('ethers');
const config = require('../config');
const contractArtifact = require('../../../contracts/artifacts/contracts/ViolenceReport.sol/ViolenceReport.json');

function toContractHash(str) {
    return str ? str.toLowerCase().replace(/^0x/, '') : str;
}

class BlockchainService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(config.PROVIDER_URL);
        this.wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, this.provider);
        this.contract = new ethers.Contract(
            config.CONTRACT_ADDRESS,
            contractArtifact.abi,
            this.wallet
        );
    }

    async submitReport(reportData) {
        try {
            const contract = await this.contract;
            
            console.log('Submitting report with data:', reportData);
            console.log('Report hash:', reportData.reportHash);
            
            // Hanya kirim reportHash ke smart contract
            const tx = await contract.submitReport(reportData.reportHash);
            const receipt = await tx.wait();
            
            // Get timestamp from event (with proper error handling)
            let timestamp = null;
            if (receipt.events && Array.isArray(receipt.events)) {
                const event = receipt.events.find(e => e.event === 'ReportSubmitted');
                if (event && event.args) {
                    timestamp = event.args.timestamp;
                }
            }
            
            // If we can't get timestamp from event, use current time
            if (!timestamp) {
                timestamp = Math.floor(Date.now() / 1000);
                console.log('Could not get timestamp from event, using current time');
            }
            
            console.log('Report submitted to blockchain at:', new Date(Number(timestamp) * 1000).toLocaleString('id-ID', {
                timeZone: 'Asia/Makassar',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }));
            
            return receipt;
        } catch (error) {
            console.error('Error submitting report to blockchain:', error);
            throw error;
        }
    }

    async verifyReport(reportHash) {
        try {
            const hashString = toContractHash(reportHash);
            const exists = await this.contract.verifyReport(hashString);
            return exists;
        } catch (error) {
            console.error('Error verifying report:', error);
            throw error;
        }
    }

    async getReport(reportHash) {
        try {
            const hashString = toContractHash(reportHash);
            const exists = await this.contract.verifyReport(hashString);
            
            if (!exists) {
                return null;
            }
            
            // Since the contract only stores basic info, we return what we can
            return {
                reportHash,
                exists: true
            };
        } catch (error) {
            console.error('Error getting report:', error);
            // Return null instead of throwing error for non-existent reports
            return null;
        }
    }

    async getAllReports() {
        try {
            const contract = await this.contract;
            const reports = await contract.getAllReports();
            
            // Format timestamps for each report
            reports.forEach(report => {
                const timestamp = Number(report.timestamp) * 1000; // Convert to milliseconds
                console.log('Report', report.reportHash, 'timestamp:', new Date(timestamp).toLocaleString('id-ID', {
                    timeZone: 'Asia/Makassar',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }));
            });
            
            return reports;
        } catch (error) {
            console.error('Error getting reports from blockchain:', error);
            throw error;
        }
    }

    isValidAdmin(address) {
        return address.toLowerCase() === config.ADMIN_WALLET.toLowerCase();
    }
}

module.exports = new BlockchainService(); 