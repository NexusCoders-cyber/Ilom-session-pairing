const fs = require('fs-extra');
const path = require('path');
const pino = require("pino");

const logger = pino({ level: "info" });
const SESSION_PATH = './session';

function ensureBase64Padding(base64String) {
    const padding = base64String.length % 4;
    if (padding > 0) {
        return base64String + '='.repeat(4 - padding);
    }
    return base64String;
}

function decodeBase64Session(encodedData) {
    try {
        const paddedData = ensureBase64Padding(encodedData);
        return Buffer.from(paddedData, 'base64').toString('utf8');
    } catch (error) {
        throw new Error('Failed to decode base64 session data');
    }
}

async function processSessionCredentials() {
    if (process.env.SESSION_ID && process.env.SESSION_ID.trim() !== '') {
        try {
            logger.info('Processing SESSION_ID from environment...');
            
            const sessionId = process.env.SESSION_ID.trim();
            await fs.ensureDir(SESSION_PATH);
            
            if (sessionId.startsWith('Ilom~') || sessionId.includes('Ilom~')) {
                const cleanId = sessionId.replace(/^Ilom~/, '');
                
                try {
                    const decodedData = decodeBase64Session(cleanId);
                    const sessionData = JSON.parse(decodedData);
                    await fs.writeJSON(path.join(SESSION_PATH, 'creds.json'), sessionData);
                    logger.info('✓ Session loaded from Ilom format');
                    return true;
                } catch (err) {
                    logger.error('✗ Failed to parse Ilom session:', err.message);
                }
            }
            
            if (sessionId.startsWith('{') && sessionId.endsWith('}')) {
                try {
                    const sessionData = JSON.parse(sessionId);
                    await fs.writeJSON(path.join(SESSION_PATH, 'creds.json'), sessionData);
                    logger.info('✓ Session loaded from JSON format');
                    return true;
                } catch (err) {
                    logger.error('✗ Failed to parse JSON format:', err.message);
                }
            }
            
            try {
                const decodedData = decodeBase64Session(sessionId);
                const sessionData = JSON.parse(decodedData);
                await fs.writeJSON(path.join(SESSION_PATH, 'creds.json'), sessionData);
                logger.info('✓ Session loaded from base64 format');
                return true;
            } catch (err) {
                logger.warn('⚠ Base64 decode failed:', err.message);
            }
            
            try {
                const sessionData = JSON.parse(sessionId);
                await fs.writeJSON(path.join(SESSION_PATH, 'creds.json'), sessionData);
                logger.info('✓ Session loaded from direct format');
                return true;
            } catch (err) {
                logger.error('✗ All session parsing methods failed:', err.message);
            }
            
            const sessionFile = path.join(SESSION_PATH, 'session_id.txt');
            await fs.writeFile(sessionFile, sessionId);
            logger.warn('⚠ Session saved as raw text, may need manual pairing');
            return false;
            
        } catch (error) {
            logger.error('✗ Failed to process SESSION_ID:', error.message);
            return false;
        }
    }
    
    logger.info('No SESSION_ID found in environment variables');
    return false;
}

module.exports = { 
    processSessionCredentials,
    ensureBase64Padding,
    decodeBase64Session
};