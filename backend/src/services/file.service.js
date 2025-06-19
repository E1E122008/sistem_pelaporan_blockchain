const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const REPORTER_DATA_PATH = path.join(__dirname, '../reportData.json');

function readReporterData() {
    try {
        if (!fs.existsSync(REPORTER_DATA_PATH)) return {};
        const raw = fs.readFileSync(REPORTER_DATA_PATH, 'utf-8');
        return JSON.parse(raw);
    } catch (e) {
        return {};
    }
}

function writeReporterData(data) {
    fs.writeFileSync(REPORTER_DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

class FileService {
    constructor() {
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(config.UPLOAD_DIR)) {
            fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });
        }
    }

    async saveFile(file) {
        try {
            const fileBuffer = file.buffer;
            const fileHash = this.calculateHash(fileBuffer);
            const fileName = `${fileHash}${path.extname(file.originalname)}`;
            const filePath = path.join(config.UPLOAD_DIR, fileName);

            await fs.promises.writeFile(filePath, fileBuffer);
            return {
                hash: fileHash,
                path: filePath
            };
        } catch (error) {
            console.error('Error saving file:', error);
            throw error;
        }
    }

    calculateHash(buffer) {
        return crypto
            .createHash('sha256')
            .update(buffer)
            .digest('hex');
    }

    async verifyFile(filePath, expectedHash) {
        try {
            const fileBuffer = await fs.promises.readFile(filePath);
            const actualHash = this.calculateHash(fileBuffer);
            return actualHash === expectedHash;
        } catch (error) {
            console.error('Error verifying file:', error);
            throw error;
        }
    }

    saveReportDetails(reportHash, details) {
        const data = readReporterData();
        data[reportHash] = details;
        writeReporterData(data);
    }

    getReportDetails(reportHash) {
        const data = readReporterData();
        return data[reportHash] || null;
    }
}

module.exports = new FileService(); 