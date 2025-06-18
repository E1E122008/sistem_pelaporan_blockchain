const express = require('express');
const router = express.Router();
const multer = require('multer');
const { adminAuth } = require('../middleware/auth.middleware');
const blockchainService = require('../services/blockchain.service');
const fileService = require('../services/file.service');
const { hashReportData } = require('../utils/hashReport');

const upload = multer({ storage: multer.memoryStorage() });

// Submit a new report (public)
router.post('/submit', upload.single('file'), async (req, res) => {
    try {
        const { violenceType, location, relationWithPerpetrator, date } = req.body;
        let fileName = '';
        if (req.file) {
            await fileService.saveFile(req.file);
            fileName = req.file.originalname;
        }
        const dataString = `${violenceType}|${location}|${relationWithPerpetrator}|${new Date(date).getTime()}|${fileName}`;
        const reportHash = hashReportData(
            violenceType,
            location,
            relationWithPerpetrator,
            new Date(date).getTime(),
            fileName
        );
        console.log('DATA STRING UNTUK HASH:', dataString);
        console.log('HASH GABUNGAN:', reportHash);

        await blockchainService.submitReport(
            reportHash,
            violenceType,
            location,
            relationWithPerpetrator,
            new Date(date).getTime(),
            fileName
        );

        res.status(201).json({
            message: 'Report submitted successfully',
            reportHash,
            dataString
        });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ error: 'Failed to submit report' });
    }
});

// Verify a report by hash (public) - returns report details if exists
router.get('/verify/:hash', async (req, res) => {
    try {
        const report = await blockchainService.getReport(req.params.hash);
        if (report) {
            res.json(report);
        } else {
            res.status(404).json({ error: 'Report not found' });
        }
    } catch (error) {
        console.error('Error verifying report:', error);
        res.status(500).json({ error: 'Failed to verify report' });
    }
});

// Get all reports (admin only)
router.get('/', async (req, res) => {
    try {
        const reports = await blockchainService.getAllReports();
        res.json(reports);
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
        const hashes = await blockchainService.contract.getAllReportHashes();
        res.json(hashes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get all hashes' });
    }
});

module.exports = router; 