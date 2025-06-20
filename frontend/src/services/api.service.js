import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

class ApiService {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    setAdminHeader(walletAddress) {
        if (walletAddress) {
            this.api.defaults.headers['x-wallet-address'] = walletAddress;
        } else {
            delete this.api.defaults.headers['x-wallet-address'];
        }
    }

    async submitReport(formData) {
        try {
            const response = await this.api.post('/reports/submit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting report:', error);
            throw error;
        }
    }

    async verifyReport(hash) {
        try {
            const response = await this.api.get(`/reports/verify/${hash}`);
            return response.data;
        } catch (error) {
            console.error('Error verifying report:', error);
            throw error;
        }
    }

    async getAllReports() {
        try {
            const response = await this.api.get('/reports');
            return response.data;
        } catch (error) {
            console.error('Error getting reports:', error);
            throw error;
        }
    }

    async getReportDetails(hash) {
        try {
            const response = await this.api.get(`/reports/details/${hash}`);
            return response.data;
        } catch (error) {
            console.error('Error getting report details:', error);
            throw error;
        }
    }

    async getAdminWallet() {
        try {
            const response = await this.api.get('/reports/admin-wallet');
            return response.data;
        } catch (error) {
            console.error('Error getting admin wallet:', error);
            throw error;
        }
    }
}

export default new ApiService(); 