const mega = require("megajs");

// MEGA account credentials - load from environment variables for security
const email = process.env.MEGA_EMAIL || '';
const password = process.env.MEGA_PASSWORD || '';

async function upload(fileStream, fileName) {
    try {
        console.log('Attempting to upload to MEGA:', fileName);
        
        // Check if MEGA credentials are available
        if (!email || !password) {
            throw new Error('MEGA credentials not configured');
        }
        
        // Create storage instance
        const storage = await new Promise((resolve, reject) => {
            const stor = new mega.Storage({
                email: email,
                password: password
            }, (err) => {
                if (err) reject(err);
                else resolve(stor);
            });
        });

        // Upload file
        const uploadStream = storage.upload({
            name: fileName,
            size: fileStream.readableLength || undefined
        });

        fileStream.pipe(uploadStream);

        return new Promise((resolve, reject) => {
            uploadStream.on('complete', (file) => {
                const url = file.link();
                console.log('MEGA upload successful:', url);
                resolve(url);
            });

            uploadStream.on('error', (error) => {
                console.error('MEGA upload failed:', error);
                reject(error);
            });
        });

    } catch (error) {
        console.error('MEGA connection failed:', error);
        throw error;
    }
}

module.exports = { upload };