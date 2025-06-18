import { ethers } from 'ethers';

// ABI untuk smart contract (disederhanakan)
const CONTRACT_ABI = [
    "function getAllReportHashes() view returns (bytes32[])",
    "function getReport(bytes32 reportHash) view returns (string violenceType, string location, uint256 date, string relationWithPerpetrator)",
    "function isAdmin(address user) view returns (bool)",
    "function addReport(bytes32 reportHash, string violenceType, string location, uint256 date, string relationWithPerpetrator)"
];

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Ganti dengan address contract yang sudah di-deploy

class BlockchainService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
    }

    async connect() {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed');
        }

        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.provider = new ethers.BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();
            const address = await this.signer.getAddress();
            
            // Initialize contract
            this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
            
            // Save to localStorage
            localStorage.setItem('walletAddress', address);
            
            return address;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            throw error;
        }
    }

    async connectWallet() {
        return this.connect();
    }

    async getWalletAddress() {
        if (!this.signer) {
            throw new Error('Wallet not connected');
        }
        return await this.signer.getAddress();
    }

    async isConnected() {
        try {
            return !!this.signer && !!(await this.signer.getAddress());
        } catch {
            return false;
        }
    }

    async isAdmin(address) {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }
        
        try {
            return await this.contract.isAdmin(address);
        } catch (error) {
            console.error('Error checking admin status:', error);
            // Fallback: check if address is in admin list
            const adminAddresses = [
                '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Hardhat account 0
                '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Hardhat account 1
                '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', // Hardhat account 2
            ];
            return adminAddresses.includes(address.toLowerCase());
        }
    }

    async getAllReports() {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }
        
        try {
            const hashes = await this.contract.getAllReportHashes();
            const reports = [];
            
            for (const hash of hashes) {
                try {
                    const report = await this.contract.getReport(hash);
                    reports.push({
                        reportHash: hash,
                        violenceType: report[0],
                        location: report[1],
                        date: report[2].toString(),
                        relationWithPerpetrator: report[3]
                    });
                } catch (error) {
                    console.error(`Error fetching report ${hash}:`, error);
                }
            }
            
            return reports;
        } catch (error) {
            console.error('Error fetching all reports:', error);
            throw error;
        }
    }

    async getReport(hash) {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }
        
        try {
            const report = await this.contract.getReport(hash);
            return {
                reportHash: hash,
                violenceType: report[0],
                location: report[1],
                date: report[2].toString(),
                relationWithPerpetrator: report[3]
            };
        } catch (error) {
            console.error('Error fetching report:', error);
            throw error;
        }
    }

    async addReport(reportHash, violenceType, location, date, relationWithPerpetrator) {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }
        
        try {
            const tx = await this.contract.addReport(
                reportHash,
                violenceType,
                location,
                date,
                relationWithPerpetrator
            );
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error adding report:', error);
            throw error;
        }
    }

    async disconnect() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('adminWallet');
    }
}

export default new BlockchainService(); 