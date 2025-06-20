const express = require('express');
const router = express.Router();
const multer = require('multer');
const { adminAuth } = require('../middleware/auth.middleware');
const blockchainService = require('../services/blockchain.service');
const fileService = require('../services/file.service');
const { hashReportData } = require('../utils/hashReport');
const path = require('path');

const upload = multer({ storage: multer.memoryStorage() });

// Submit a new report (public)
router.post('/submit', upload.single('file'), async (req, res) => {
    try {
        const timestamp = Date.now();
        const localTime = new Date(timestamp).toLocaleString('id-ID', {
            timeZone: 'Asia/Makassar',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        console.log('Report submission timestamp:', timestamp, '- Waktu WITA:', localTime);

        const { violenceType, location, relationWithPerpetrator, date, reporterName, reporterContact } = req.body;
        let fileName = '';

        if (req.file) {
            // Generate hash for the file and use it as filename
            const crypto = require('crypto');
            const fileHash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
            fileName = `${fileHash}${req.file.originalname ? path.extname(req.file.originalname) : ''}`;
        }

        // Generate report hash
        const reportHash = hashReportData(violenceType, location, relationWithPerpetrator, date, fileName);
        console.log('HASH GABUNGAN:', reportHash);

        // Submit to blockchain
        await blockchainService.submitReport({ reportHash });

        // Save all report details
        fileService.saveReportDetails(reportHash, {
            violenceType,
            location,
            relationWithPerpetrator,
            date,
            reporterName: reporterName || '',
            reporterContact: reporterContact || '',
            fileName
        });

        res.status(200).json({
            message: 'Report submitted successfully',
            reportHash,
            fileName
        });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify a report by hash (public) - returns report details if exists
router.get('/verify/:hash', async (req, res) => {
    try {
        const report = await blockchainService.getReport(req.params.hash);
        if (report) {
            const details = fileService.getReportDetails(req.params.hash);
            res.json({
                ...report,
                ...details
            });
        } else {
            res.status(404).json({ error: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify report' });
    }
});

// Get all reports (admin only)

router.get('/', async (req, res) => {
    try {
        const reports = await blockchainService.getAllReports();
        const reportsWithDetails = reports.map(r => {
            const details = fileService.getReportDetails(r.reportHash) || {};
            return {
                reportHash: r.reportHash || details.reportHash || '',
                timestamp: r.timestamp ? Number(r.timestamp) : undefined,
                ...details
            };
        });
        res.json(reportsWithDetails);
    } catch (error) {
        console.error('Error getting reports:', error);
        res.status(500).json({ error: 'Failed to get reports' });
    }
});

// Get specific report by hash (admin only)
router.get('/details/:hash', adminAuth, async (req, res) => {
    try {
        const report = await blockchainService.getReport(req.params.hash);
        if (report) {
            res.json(report);
        } else {
            res.status(404).json({ error: 'Report not found' });
        }
    } catch (error) {
        console.error('Error getting report details:', error);
        res.status(500).json({ error: 'Failed to get report details' });
    }
});

// Endpoint debug: tampilkan semua hash laporan di contract
router.get('/all-hashes', async (req, res) => {
    try {
        const reports = await blockchainService.getAllReports();
        const hashes = reports.map(report => report.reportHash);
        res.json(hashes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get all hashes' });
    }
});

// Debug endpoint: check contract function signatures
router.get('/debug/contract', async (req, res) => {
    try {
        const contract = blockchainService.contract;
        const abi = contract.interface.fragments.map(f => ({
            name: f.name,
            type: f.type,
            inputs: f.inputs?.map(i => ({ name: i.name, type: i.type })) || []
        }));
        res.json({
            address: await contract.getAddress(),
            abi: abi
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test endpoint: verify contract connection
router.get('/test/contract', async (req, res) => {
    try {
        const contract = blockchainService.contract;
        const address = await contract.getAddress();
        const owner = await contract.owner();
        res.json({
            contractAddress: address,
            owner: owner,
            status: 'Connected'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Tambahkan endpoint untuk expose admin wallet ke frontend
router.get('/admin-wallet', (req, res) => {
    const config = require('../config');
    res.json({ adminWallet: config.ADMIN_WALLET });
});

module.exports = router; 