# 🎆 ILOM - WhatsApp Session Generator

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/WhatsApp-Bot-25D366?style=for-the-badge&logo=whatsapp" alt="WhatsApp Bot">
  <img src="https://img.shields.io/badge/Deploy-Ready-blue?style=for-the-badge" alt="Deploy Ready">
</p>

<p align="center">
  <strong>A professional, modern WhatsApp bot session generator with beautiful UI and multi-platform deployment support.</strong>
</p>

---

## ✨ Features

- **🎨 Modern UI**: Beautiful, responsive interface with smooth animations
- **📱 QR Code Generation**: Quick WhatsApp Web scanning with live timer
- **📞 Pairing Code**: Phone number-based authentication with validation
- **🔒 Secure Sessions**: Encrypted storage with MEGA integration
- **🚀 Multi-Platform**: Deploy anywhere - Render, Koyeb, Heroku, Railway, Vercel
- **⚡ Fast Performance**: Optimized for speed and reliability
- **📱 Mobile-First**: Perfect experience on all devices
- **🌍 Latest Node.js**: Full support for Node.js 18+ and latest packages

---

## 🚀 One-Click Deploy

### Deploy to Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=YOUR_REPO_URL)

### Deploy to Railway  
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YOUR_TEMPLATE_ID)

### Deploy to Heroku
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=YOUR_REPO_URL)

### Deploy to Koyeb
[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?type=git&repository=YOUR_REPO_URL)

---

## 💻 Manual Installation

### Prerequisites
- **Node.js 18+** (LTS recommended)
- **npm 9+** or **yarn**
- **Git**

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ilom-session-generator.git
cd ilom-session-generator

# Install dependencies
npm install

# Start the application
npm start
```

The application will be available at **http://localhost:5000**

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `5000` |
| `SESSION_ID` | Existing session to load | No | - |
| `NODE_ENV` | Environment mode | No | `production` |

### Platform Configurations

#### For Render
```yaml
# render.yaml
services:
  - type: web
    name: ilom-session-generator
    env: node
    buildCommand: npm ci
    startCommand: npm start
    envVars:
      - key: NODE_VERSION
        value: 20
```

#### For Railway
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## 📋 API Documentation

### Main Routes
- `GET /` - Dashboard with QR and Pairing options
- `GET /qr` - QR code generation interface  
- `GET /pair` - Phone number pairing interface

### API Endpoints
- `GET /server` - Generates QR code image
- `GET /code?number={phone}` - Generates pairing code

---

## 🎨 UI Features

### Modern Design System
- **Glassmorphism effects** with backdrop blur
- **Smooth animations** and micro-interactions
- **Responsive grid layouts** for all screen sizes
- **Beautiful gradients** and color schemes
- **Interactive buttons** with hover effects
- **Professional typography** with Inter font family

### Mobile Optimization
- Touch-friendly interface
- Optimized for mobile browsers
- Progressive Web App capabilities
- Fast loading times

---

## 🔒 Security & Performance

### Security Features
- Input validation and sanitization
- Secure session handling
- CORS protection
- Rate limiting protection
- Modern security headers

### Performance Optimizations
- Efficient memory management
- Fast QR code generation
- Optimized file handling
- Clean temporary file management

---

## 🧪 Testing Your Deployment

After deployment, test these features:

1. **Main Interface**: Visit your deployment URL
2. **QR Code**: Click "Generate QR Code" and scan with WhatsApp
3. **Pairing Code**: Click "Pairing Code" and enter your phone number
4. **Mobile Experience**: Test on different devices

---

## 🐛 Troubleshooting

### Common Issues

**"Port already in use"**
```bash
pkill -f node  # Kill existing Node processes
```

**"Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**QR Code not loading**
- Check if `/server` endpoint responds
- Verify WhatsApp Web functionality
- Check network connectivity

---

## 🔄 Updates & Maintenance

### Keeping Updated
```bash
git pull origin main
npm install
npm start
```

### Package Updates
```bash
npm update
npm audit fix
```

---

## 📞 Support & Community

- 🐛 **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/ilom-session-generator/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/ilom-session-generator/discussions)
- 📧 **Email**: support@ilom.bot
- 🌐 **Website**: [https://ilom.bot](https://ilom.bot)

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [Express.js](https://expressjs.com/) - Web framework
- [MEGA](https://mega.io/) - Secure cloud storage
- Modern web technologies and open-source community

---

<p align="center">
  <strong>⭐ Star this repo if it helped you! ⭐</strong>
</p>

<p align="center">
  <strong>Made with ❤️ by the ILOM Team</strong>
</p>

<p align="center">
  🚀 <strong>Ready to deploy? Choose your platform above!</strong> 🚀
</p>


