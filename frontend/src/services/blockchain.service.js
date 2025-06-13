import { ethers } from 'ethers';

class BlockchainService {
    constructor() {
        this.provider = null;
        this.signer = null;
    }

    async connectWallet() {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed');
        }

        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.provider = new ethers.BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();
            const address = await this.signer.getAddress();
            return address;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            throw error;
        }
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

    async disconnect() {
        this.provider = null;
        this.signer = null;
        localStorage.removeItem('adminWallet');
    }
}

export default new BlockchainService(); 