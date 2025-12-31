const express = require('express');
const app = express();
__path = process.cwd()
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const { processSessionCredentials } = require('./session-processor');

(async () => {
    try {
        await processSessionCredentials();
        console.log('✓ Session processor initialized');
    } catch (error) {
        console.log('⚠ Session processor:', error.message);
    }
})();

let qrServer = require('./qr'),
    pairCode = require('./pair');

require('events').EventEmitter.defaultMaxListeners = 500;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/server', qrServer);
app.use('/code', pairCode);

app.use('/pair', async (req, res, next) => {
    res.sendFile(__path + '/pair.html')
});

app.use('/qr', async (req, res, next) => {
    res.sendFile(__path + '/qr.html')
});

app.use('/', async (req, res, next) => {
    res.sendFile(__path + '/main.html')
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════╗
║                                        ║
║    ILOM Bot Session Manager            ║
║                                        ║
║    Server: http://0.0.0.0:${PORT}        ║
║    Status: ✓ Online                    ║
║                                        ║
║    Features:                           ║
║    • QR Code Generation                ║
║    • Phone Pairing                     ║
║    • Session Download                  ║
║    • Multi-format Export               ║
║                                        ║
╚════════════════════════════════════════╝
`);
});

server.on('error', (err) => {
    console.error('✗ Server failed to start:', err.message);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('✗ Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('✗ Unhandled Rejection:', reason);
});

module.exports = app;