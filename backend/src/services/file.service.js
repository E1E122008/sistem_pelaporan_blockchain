const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const config = require('../config');

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
}

module.exports = new FileService(); 