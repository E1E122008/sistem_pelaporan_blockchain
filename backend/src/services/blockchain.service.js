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

    async submitReport(reportHash, violenceType, location, relationWithPerpetrator, date, fileName) {
        try {
            const hashString = toContractHash(reportHash);
            const tx = await this.contract.submitReport(
                hashString,
                violenceType,
                location,
                relationWithPerpetrator,
                date,
                fileName
            );
            await tx.wait();
            return true;
        } catch (error) {
            console.error('Error submitting report:', error);
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
            const report = await this.contract.getReport(hashString);
            
            // Check if report exists
            if (!report || !report.exists) {
                return null;
            }
            
            return {
                reportHash,
                violenceType: report.violenceType,
                location: report.location,
                relationWithPerpetrator: report.relationWithPerpetrator,
                date: report.date.toString(),
                fileName: report.fileName,
                exists: report.exists
            };
        } catch (error) {
            console.error('Error getting report:', error);
            // Return null instead of throwing error for non-existent reports
            return null;
        }
    }

    async getAllReports() {
        try {
            const hashes = await this.contract.getAllReportHashes();
            const reports = [];
            
            for (const hash of hashes) {
                try {
                    const report = await this.getReport(hash);
                    if (report) {
                        reports.push(report);
                    }
                } catch (error) {
                    console.error(`Error fetching report ${hash}:`, error);
                }
            }
            
            return reports;
        } catch (error) {
            console.error('Error getting all reports:', error);
            throw error;
        }
    }

    isValidAdmin(address) {
        return address.toLowerCase() === config.ADMIN_WALLET.toLowerCase();
    }
}

module.exports = new BlockchainService(); 