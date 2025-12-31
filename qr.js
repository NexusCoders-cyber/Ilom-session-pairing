const { makeid } = require('./gen-id');
const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("@whiskeysockets/baileys");

const activeSessions = new Map();

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

function ensureBase64Padding(base64String) {
    const padding = base64String.length % 4;
    if (padding > 0) {
        return base64String + '='.repeat(4 - padding);
    }
    return base64String;
}

router.get('/', async (req, res) => {
    const id = makeid();
    
    async function ILOM_QR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        
        try {
            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "silent" }),
                browser: ['Chrome (Linux)', '', ''],
                mobile: false,
            });
            
            sock.ev.on('creds.update', saveCreds);
            
            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect, qr } = s;
                
                if (qr) {
                    try {
                        const qrImage = await QRCode.toDataURL(qr, {
                            errorCorrectionLevel: 'M',
                            type: 'image/png',
                            quality: 0.95,
                            margin: 1,
                            width: 300
                        });
                        
                        const base64Data = qrImage.split(',')[1];
                        const imgBuffer = Buffer.from(base64Data, 'base64');
                        
                        if (!res.headersSent) {
                            res.writeHead(200, {
                                'Content-Type': 'image/png',
                                'Content-Length': imgBuffer.length
                            });
                            res.end(imgBuffer);
                        }
                    } catch (qrError) {
                        console.error('✗ QR generation error:', qrError.message);
                        if (!res.headersSent) {
                            res.status(500).send('QR generation failed');
                        }
                    }
                }
                
                if (connection == "open") {
                    await delay(5000);
                    
                    let sessionId;
                    
                    try {
                        const rf = `./temp/${id}/creds.json`;
                        const sessionData = fs.readFileSync(rf, 'utf8');
                        const credsJson = JSON.parse(sessionData);
                        const base64Data = Buffer.from(sessionData).toString('base64');
                        const paddedBase64 = ensureBase64Padding(base64Data);
                        sessionId = "Ilom~" + paddedBase64;
                        
                        activeSessions.set(id, {
                            sessionId: sessionId,
                            credsJson: credsJson,
                            rawJson: sessionData,
                            timestamp: Date.now()
                        });
                        
                        setTimeout(() => activeSessions.delete(id), 300000);
                        
                        console.log('✓ QR session created:', sock.user.id.split(':')[0]);
                    } catch (sessionError) {
                        console.error('✗ Session error:', sessionError.message);
                        sessionId = "Session_Error";
                    }
                    
                    try {
                        await sock.sendMessage(sock.user.id, { text: sessionId });
                        await delay(500);
                        
                        const welcomeMessage = `╔═══════════════════════════╗
║   ✓ ILOM SESSION ACTIVE   ║
╚═══════════════════════════╝

*QR Connection Established Successfully*

Your WhatsApp bot session is now fully operational.

╔══════════════════════╗
║   SECURITY NOTICE    ║
╚══════════════════════╝

⚠️ *Keep Your Session Secure*
• Never share your session ID
• Store in a secure location
• Use only for authorized purposes

✓ *Platform Features*
• AI-powered responses
• Multi-device support  
• Secure encryption
• Real-time sync

━━━━━━━━━━━━━━━━━━━━━━
© 2025 ILOM Platform
Secure • Reliable • Advanced
━━━━━━━━━━━━━━━━━━━━━━`;
                        
                        await sock.sendMessage(sock.user.id, { text: welcomeMessage });
                        await delay(500);
                        await sock.sendMessage(sock.user.id, {
                            text: "🎉 *Setup Complete!*\n\nYour bot is ready to use. Check the session ID above and keep it safe."
                        });
                        
                    } catch (sendError) {
                        console.error('✗ Message error:', sendError.message);
                    }
                    
                    await delay(1000);
                    
                    try {
                        await sock.ws.close();
                    } catch (e) {}
                    
                    setTimeout(() => {
                        removeFile('./temp/' + id);
                        console.log(`✓ Cleanup completed`);
                    }, 5000);
                    
                } else if (connection === "close") {
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    if (statusCode !== 401 && statusCode !== 403) {
                        console.log('Connection closed, retrying...');
                        await delay(2000);
                        ILOM_QR_CODE();
                    } else {
                        console.log('Auth failed, cleaning up...');
                        removeFile('./temp/' + id);
                    }
                }
            });
            
        } catch (err) {
            console.error("✗ Service error:", err.message);
            removeFile('./temp/' + id);
            if (!res.headersSent) {
                res.status(500).send('Service Unavailable');
            }
        }
    }
    
    await ILOM_QR_CODE();
});

router.get('/session/:id', async (req, res) => {
    const sessionId = req.params.id;
    const format = req.query.format || 'base64';
    
    const session = activeSessions.get(sessionId);
    
    if (!session) {
        return res.status(404).json({ 
            error: 'Session not found or expired',
            message: 'Session may have expired after 5 minutes'
        });
    }
    
    try {
        switch(format) {
            case 'json':
                res.json(session.credsJson);
                break;
                
            case 'raw':
                res.setHeader('Content-Type', 'application/json');
                res.send(session.rawJson);
                break;
                
            case 'download':
                res.setHeader('Content-Disposition', 'attachment; filename=creds.json');
                res.setHeader('Content-Type', 'application/json');
                res.send(session.rawJson);
                break;
                
            case 'base64':
            default:
                res.json({ 
                    sessionId: session.sessionId,
                    format: 'Ilom~base64'
                });
                break;
        }
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to retrieve session',
            message: error.message 
        });
    }
});

module.exports = router;
