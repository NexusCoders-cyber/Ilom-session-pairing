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
    Browsers,
    jidNormalizedUser
} = require("@whiskeysockets/baileys");
const { upload } = require('./mega');
function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}
router.get('/', async (req, res) => {
    const id = makeid();
 //   let num = req.query.number;
    async function ILOM_PAIR_CODE() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState('./temp/' + id);
        try {
var items = ["Safari"];
function selectRandomItem(array) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
var randomItem = selectRandomItem(items);
            
            let sock = makeWASocket({
                        
                                auth: state,
                                printQRInTerminal: false,
                                logger: pino({
                                        level: "silent"
                                }),
                                browser: Browsers.macOS("Desktop"),
                        });
            
            sock.ev.on('creds.update', saveCreds);
            sock.ev.on("connection.update", async (s) => {
                const {
                    connection,
                    lastDisconnect,
                    qr
                } = s;
              if (qr) await res.end(await QRCode.toBuffer(qr));
                if (connection == "open") {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    let rf = __dirname + `/temp/${id}/creds.json`;
                    function generateRandomText() {
                        const prefix = "3EB";
                        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let randomText = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            const randomIndex = Math.floor(Math.random() * characters.length);
                            randomText += characters.charAt(randomIndex);
                        }
                        return randomText;
                    }
                    const randomText = generateRandomText();
                    let sessionId;
                    try {
                        console.log('Attempting MEGA upload for session:', sock.user.id);
                        const { upload } = require('./mega');
                        const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                        const string_session = mega_url.replace('https://mega.nz/file/', '');
                        sessionId = "Ilom~" + string_session;
                        console.log('MEGA upload successful, session ID created');
                    } catch (megaError) {
                        console.log('MEGA upload failed, sending session data directly:', megaError.message);
                        // Fallback: send session data as base64
                        const sessionData = fs.readFileSync(rf, 'utf8');
                        sessionId = "Ilom~" + Buffer.from(sessionData).toString('base64');
                        console.log('Direct session ID created as fallback');
                    }
                    
                    try {
                        let code = await sock.sendMessage(sock.user.id, { text: sessionId });
                        let desc = `┌────────────────────────────┐
│    *🎆 ILOM BOT CONNECTED! 🎆*    │
└────────────────────────────┘

👋 *Welcome to ILOM!*
Your WhatsApp bot session has been successfully created.

🔐 *Your Session ID:*
Sent in the message above - keep it secure!

┌─────────────────────────┐
│    🔒 *SECURITY NOTICE* 🔒     │
└─────────────────────────┘
• Never share your session ID with anyone
• Store it in a secure location
• Use it only for your authorized bots

🌐 *ILOM Features:*
✅ Advanced AI capabilities
✅ Multi-platform support
✅ Secure session management
✅ Regular updates & improvements

┌─────────────────────────┐
│     💬 *SUPPORT & UPDATES* 💬     │
└─────────────────────────┘
🚀 Join our community for updates
🛠️ Get technical support
📚 Access documentation & guides

*© 2024 ILOM - Advanced WhatsApp Bot Platform*
🌟 Stay innovative, stay connected! 🌟`;
                        await sock.sendMessage(sock.user.id, {
text: desc,
contextInfo: {
externalAdReply: {
title: "🎆 ILOM Bot Successfully Connected! 🎆",
thumbnailUrl: "https://files.catbox.moe/bqs70b.jpg",
sourceUrl: "https://ilom.bot",
mediaType: 1,
renderLargerThumbnail: true
}  
}
},
{quoted:code })
                    } catch (e) {
                            console.error('Session sending error:', e);
                            let ddd = await sock.sendMessage(sock.user.id, { text: 'Session creation failed: ' + e.toString() });
                            let desc = `*Hey there, ILOM User!* 👋🏻

Thanks for using *ILOM* — your session has been successfully created!

🔐 *Session ID:* Sent above  
⚠️ *Keep it safe!* Do NOT share this ID with anyone.

——————

*✅ Stay Updated:*  
Connect with ILOM Bot Network

*💻 Source Code:*  
Explore ILOM project capabilities

——————

> *© Powered by ILOM*
Stay connected and innovate. ✌🏻*`;
                            await sock.sendMessage(sock.user.id, {
text: desc,
contextInfo: {
externalAdReply: {
title: "ɪʟᴏᴍ 𝕮𝖔𝖓𝖓𝖊𝖈𝖙𝖊𝖉 ✅  ",
thumbnailUrl: "https://files.catbox.moe/bqs70b.jpg",
sourceUrl: "https://ilom.bot",
mediaType: 2,
renderLargerThumbnail: true,
showAdAttribution: true
}  
}
},
{quoted:ddd })
                    }
                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} ILOM Connected ✅ Session created successfully.`);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    ILOM_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restated");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }
    await ILOM_PAIR_CODE();
});
module.exports = router;
