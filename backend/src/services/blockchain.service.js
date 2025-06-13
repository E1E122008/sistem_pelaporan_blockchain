const { ethers } = require('ethers');
const config = require('../config');
const contractArtifact = require('../../../contracts/artifacts/contracts/ViolenceReport.sol/ViolenceReport.json');

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

    async submitReport(violenceType, location, date, fileHash) {
        try {
            const tx = await this.contract.submitReport(
                violenceType,
                location,
                date,
                fileHash
            );
            await tx.wait();
            return true;
        } catch (error) {
            console.error('Error submitting report:', error);
            throw error;
        }
    }

    async verifyReport(fileHash) {
        try {
            const exists = await this.contract.verifyReport(fileHash);
            return exists;
        } catch (error) {
            console.error('Error verifying report:', error);
            throw error;
        }
    }

    async getReport(fileHash) {
        try {
            const report = await this.contract.getReport(fileHash);
            return {
                violenceType: report.violenceType,
                location: report.location,
                date: report.date.toString(),
                fileHash: report.fileHash,
                exists: report.exists
            };
        } catch (error) {
            console.error('Error getting report:', error);
            throw error;
        }
    }

    async getAllReports() {
        try {
            const hashes = await this.contract.getAllReportHashes();
            const reports = await Promise.all(
                hashes.map(hash => this.getReport(hash))
            );
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