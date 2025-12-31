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
            const browsers = ["Chrome", "Safari", "Firefox", "Edge"];
            const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];
            
            let sock = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: "silent" }),
                browser: Browsers.macOS(randomBrowser)
            });
            
            sock.ev.on('creds.update', saveCreds);
            
            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect, qr } = s;
                
                if (qr) {
                    await res.end(await QRCode.toBuffer(qr));
                }
                
                if (connection == "open") {
                    await delay(5000);
                    
                    let rf = __dirname + `/temp/${id}/creds.json`;
                    let sessionId;
                    
                    try {
                        const sessionData = fs.readFileSync(rf, 'utf8');
                        const base64Data = Buffer.from(sessionData).toString('base64');
                        const paddedBase64 = ensureBase64Padding(base64Data);
                        sessionId = "Ilom~" + paddedBase64;
                        
                        console.log('QR Session ID created successfully for:', sock.user.id);
                    } catch (sessionError) {
                        console.error('Session creation error:', sessionError);
                        sessionId = "Session_Error";
                    }
                    
                    try {
                        await sock.sendMessage(sock.user.id, { 
                            text: sessionId 
                        });
                        
                        const welcomeMessage = `╔════════════════════════════╗
║   🎉 ILOM SESSION ACTIVE 🎉   ║
╚════════════════════════════╝

✅ *QR Connection Successful!*
Your WhatsApp bot session is now active.

🔐 *Session ID*
Sent above - Keep it secure!

╔═══════════════════════╗
║   ⚠️  SECURITY NOTICE  ⚠️   ║
╚═══════════════════════╝
• Never share your session ID
• Store it in a secure location
• Use only for authorized bots

📱 *ILOM Features*
✓ Advanced AI capabilities
✓ Multi-platform support
✓ Secure session management
✓ Real-time updates

🌐 *Support & Community*
• Technical documentation
• Active community support
• Regular feature updates

© 2025 ILOM Platform
Stay secure, stay connected! 🚀`;
                        
                        await sock.sendMessage(sock.user.id, {
                            text: welcomeMessage,
                            contextInfo: {
                                externalAdReply: {
                                    title: "ILOM - QR Session Connected",
                                    body: "Advanced WhatsApp Bot Platform",
                                    thumbnailUrl: "https://files.catbox.moe/bqs70b.jpg",
                                    sourceUrl: "https://ilom.bot",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }  
                            }
                        });
                    } catch (sendError) {
                        console.error('Message sending error:', sendError);
                    }
                    
                    await delay(100);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`✅ ${sock.user.id} - QR Session created successfully`);
                    
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(100);
                    ILOM_QR_CODE();
                }
            });
            
        } catch (err) {
            console.error("Service error:", err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }
    
    await ILOM_QR_CODE();
});

module.exports = router;