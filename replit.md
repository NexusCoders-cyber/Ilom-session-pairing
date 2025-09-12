# Overview

This is a WhatsApp session generator web application that creates session credentials for WhatsApp bots using the Baileys library. The application provides two methods for authentication: QR code scanning and phone number pairing. Generated sessions are stored securely in MEGA cloud storage and can be used with any Baileys-based WhatsApp bot.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Advanced HTML interfaces**: Three ultra-modern pages (main.html, qr.html, pair.html) with legendary-level CSS styling
- **Static serving**: Express.js serves HTML files directly without a frontend framework
- **Revolutionary design system**: Professional glassmorphism effects, 3D animations, advanced gradients, and sophisticated visual effects
- **Background image support**: Placeholder URL system for custom background integration
- **Multi-layered animations**: Complex keyframe sequences with 3D transforms and advanced easing functions
- **Interactive micro-animations**: Hover effects, button transforms, and dynamic visual feedback

## Backend Architecture
- **Express.js server**: Main application server handling HTTP requests and routing
- **Modular routing**: Separate route handlers for QR generation (/qr, /server) and pair code generation (/code, /pair)
- **Session management**: Temporary session storage in ./temp/ directory with unique IDs
- **File cleanup**: Automatic removal of temporary session files after processing

## Authentication Flow
- **QR Code method**: Generates WhatsApp Web QR codes for scanning with mobile app
- **Pair Code method**: Generates 8-digit pairing codes for phone number-based authentication
- **Baileys integration**: Uses @whiskeysockets/baileys library for WhatsApp protocol implementation
- **Browser simulation**: Mimics Safari/macOS browsers for WhatsApp Web compatibility

## Data Storage
- **MEGA cloud storage**: Uploads generated session credentials to MEGA for secure storage
- **JSON credential format**: Stores session data in standard Baileys credential format
- **Multiple format support**: Handles various session ID formats (base64, JSON, Ilom format)
- **Local temporary storage**: Uses filesystem for temporary session processing

## Security Features
- **Unique session IDs**: Random 4-character identifiers for each session generation
- **Temporary file cleanup**: Automatic removal of sensitive session files
- **Cloud encryption**: MEGA provides encrypted storage for session credentials
- **Multiple authentication methods**: Supports both QR and phone number verification

# External Dependencies

## Core Dependencies
- **@whiskeysockets/baileys**: WhatsApp Web API library for bot functionality
- **Express.js**: Web server framework for HTTP handling
- **megajs**: MEGA cloud storage client for secure file uploads
- **qrcode**: QR code generation library for WhatsApp Web authentication
- **pino**: Structured logging library for application monitoring

## Authentication & Storage
- **MEGA cloud storage**: External file storage service for session persistence
- **WhatsApp Web API**: Official WhatsApp authentication endpoints
- **@adiwajshing/keyed-db**: Database utility for Baileys key management

## Utility Libraries
- **fs-extra**: Enhanced filesystem operations for file management
- **body-parser**: HTTP request body parsing middleware
- **awesome-phonenumber**: Phone number validation and formatting
- **async-mutex**: Concurrency control for session operations

## Deployment Platforms
- **Heroku**: Primary cloud hosting platform with buildpack configuration
- **Render**: Alternative deployment option for web services
- **Koyeb**: Additional hosting platform support