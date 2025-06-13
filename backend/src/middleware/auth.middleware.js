const blockchainService = require('../services/blockchain.service');

function adminAuth(req, res, next) {
    const walletAddress = req.headers['x-wallet-address'];

    if (!walletAddress) {
        return res.status(401).json({ 
            error: 'No wallet address provided' 
        });
    }

    if (!blockchainService.isValidAdmin(walletAddress)) {
        return res.status(403).json({ 
            error: 'Access denied. Not an admin wallet.' 
        });
    }

    req.walletAddress = walletAddress;
    next();
}

module.exports = {
    adminAuth
}; 