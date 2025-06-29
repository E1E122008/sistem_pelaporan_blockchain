require('dotenv').config();
const path = require('path');

module.exports = {
    PORT: process.env.PORT || 3000,
    UPLOAD_DIR: process.env.UPLOAD_DIR || path.join(__dirname, '../uploads'),
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    PROVIDER_URL: process.env.PROVIDER_URL || 'http://127.0.0.1:8545',
    ADMIN_WALLET: process.env.ADMIN_WALLET
}; 