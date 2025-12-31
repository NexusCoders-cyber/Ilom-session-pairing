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
            const browsers = ["Chrome (Linux)", "Chrome (macOS)", "Safari (iOS)", "Firefox (Windows)"];
            const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];
            
            let sock = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: "silent" }),
                browser: Browsers.ubuntu(randomBrowser),
                syncFullHistory: false,
                markOnlineOnConnect: false,
                generateHighQualityLinkPreview: true,
                getMessage: async (key) => {
                    return { conversation: '' };
                }
            });
            
            sock.ev.on('creds.update', saveCreds);
            
            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect, qr } = s;
                
                if (qr) {
                    await res.end(await QRCode.toBuffer(qr));
                }
                
                if (connection == "open") {
                    await delay(3000);
                    
                    let rf = __dirname + `/temp/${id}/creds.json`;
                    let sessionId;
                    let sessionData;
                    let credsJson;
                    
                    try {
                        sessionData = fs.readFileSync(rf, 'utf8');
                        credsJson = JSON.parse(sessionData);
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
                        await sock.sendMessage(sock.user.id, { 
                            text: sessionId 
                        });
                        
                        await delay(500);
                        
                        const welcomeMessage = `╔═══════════════════════════╗
║   ✓ ILOM SESSION ACTIVE   ║
╚═══════════════════════════╝

*QR Connection Established Successfully*

Your WhatsApp bot session is now fully operational via QR code pairing.

╔══════════════════════╗
║   SECURITY NOTICE    ║
╚══════════════════════╝

⚠️ *Keep Your Session Secure*
• Never share your session ID
• Store in a secure location
• Use only for authorized purposes
• Regenerate if compromised

✓ *Platform Features*
• AI-powered responses
• Multi-device support  
• Secure encryption
• Real-time sync
• Auto-backup

📱 *Getting Started*
1. Save your session ID securely
2. Configure your bot settings
3. Deploy to your preferred platform
4. Monitor activity & logs

🌐 *Need Support?*
Visit our documentation for setup guides, API references, and troubleshooting help.

━━━━━━━━━━━━━━━━━━━━━━
© 2025 ILOM Platform
Secure • Reliable • Advanced
━━━━━━━━━━━━━━━━━━━━━━`;
                        
                        await sock.sendMessage(sock.user.id, {
                            text: welcomeMessage
                        });
                        
                        await delay(500);
                        
                        await sock.sendMessage(sock.user.id, {
                            text: "🎉 *Setup Complete!*\n\nYour bot is ready to use. Check the session ID above and keep it safe.\n\n_This message confirms your device has been successfully linked._"
                        });
                        
                    } catch (sendError) {
                        console.error('✗ Message error:', sendError.message);
                    }
                    
                    await delay(1000);
                    await sock.ws.close();
                    
                    setTimeout(() => {
                        removeFile('./temp/' + id);
                        console.log(`✓ Cleanup completed for: ${sock.user.id.split(':')[0]}`);
                    }, 5000);
                    
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(1000);
                    ILOM_QR_CODE();
                }
            });
            
        } catch (err) {
            console.error("✗ Service error:", err.message);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
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