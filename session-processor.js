const fs = require('fs-extra');
const path = require('path');
const pino = require("pino");

const logger = pino({ level: "info" });
const SESSION_PATH = './session';

async function processSessionCredentials() {
    if (process.env.SESSION_ID && process.env.SESSION_ID.trim() !== '') {
        try {
            logger.info('Processing SESSION_ID from environment...');
            
            const sessionId = process.env.SESSION_ID.trim();
            await fs.ensureDir(SESSION_PATH);
            
            if (sessionId.startsWith('Ilom~') || sessionId.includes('Ilom~')) {
                const cleanId = sessionId.replace('Ilom~', '');
                try {
                    const sessionData = JSON.parse(Buffer.from(cleanId, 'base64').toString());
                    await fs.writeJSON(path.join(SESSION_PATH, 'creds.json'), sessionData);
                    logger.info('✅ Session credentials loaded from Ilom format');
                    return true;
                } catch (err) {
                    logger.warn('Failed to parse Ilom session format');
                }
            }
            
            if (sessionId.startsWith('{') && sessionId.endsWith('}')) {
                const sessionData = JSON.parse(sessionId);
                await fs.writeJSON(path.join(SESSION_PATH, 'creds.json'), sessionData);
                logger.info('✅ Session credentials loaded from JSON format');
                return true;
            }
            
            try {
                const decodedData = Buffer.from(sessionId, 'base64').toString();
                const sessionData = JSON.parse(decodedData);
                await fs.writeJSON(path.join(SESSION_PATH, 'creds.json'), sessionData);
                logger.info('✅ Session credentials loaded from base64 format');
                return true;
            } catch (err) {
                logger.warn('Base64 decode failed, trying direct format...');
            }
            
            try {
                const sessionData = JSON.parse(sessionId);
                await fs.writeJSON(path.join(SESSION_PATH, 'creds.json'), sessionData);
                logger.info('✅ Session credentials loaded from direct format');
                return true;
            } catch (err) {
                logger.error('All session parsing methods failed');
            }
            
            const sessionFile = path.join(SESSION_PATH, 'session_id.txt');
            await fs.writeFile(sessionFile, sessionId);
            logger.warn('⚠️ Session saved as raw text, may need manual pairing');
            return false;
            
        } catch (error) {
            logger.error('❌ Failed to process SESSION_ID:', error);
            return false;
        }
    }
    
    return false;
}

module.exports = { processSessionCredentials };