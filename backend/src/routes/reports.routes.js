const express = require('express');
const router = express.Router();
const multer = require('multer');
const { adminAuth } = require('../middleware/auth.middleware');
const blockchainService = require('../services/blockchain.service');
const fileService = require('../services/file.service');

const upload = multer({ storage: multer.memoryStorage() });

// Submit a new report (public)
router.post('/submit', upload.single('file'), async (req, res) => {
    try {
        const { violenceType, location, date } = req.body;
        
        let fileHash = '';
        if (req.file) {
            const fileResult = await fileService.saveFile(req.file);
            fileHash = fileResult.hash;
        }

        await blockchainService.submitReport(
            violenceType,
            location,
            new Date(date).getTime(),
            fileHash
        );

        res.status(201).json({
            message: 'Report submitted successfully',
            fileHash
        });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ error: 'Failed to submit report' });
    }
});

// Verify a report by hash (public)
router.get('/verify/:hash', async (req, res) => {
    try {
        const exists = await blockchainService.verifyReport(req.params.hash);
        res.json({ exists });
    } catch (error) {
        console.error('Error verifying report:', error);
        res.status(500).json({ error: 'Failed to verify report' });
    }
});

// Get all reports (admin only)
router.get('/', adminAuth, async (req, res) => {
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
        res.json(report);
    } catch (error) {
        console.error('Error getting report details:', error);
        res.status(500).json({ error: 'Failed to get report details' });
    }
});

module.exports = router; 