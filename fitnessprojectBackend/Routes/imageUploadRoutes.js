const express = require('express');
const router = express.Router();
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const sharp = require('sharp');//it is used to decrease the size of image before uploading it to cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = multer.memoryStorage();
const upload = multer({ storage });//multer will send the response of image buffer in memory not on disk 

router.post('/uploadimage', upload.single('myimage'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ ok: false, error: 'No image file provided' });
    }

    // Optimize image: resize, convert to WebP, and compress
    sharp(file.buffer)
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 }) // Convert to WebP format for better compression
        .toBuffer(async (err, data, info) => {
            if (err) {
                console.error('Image processing error:', err);
                return res.status(500).json({ ok: false, error: 'Error processing image' });
            }

            // Upload with Cloudinary transformations for optimized delivery
            cloudinary.uploader.upload_stream({ 
                resource_type: 'auto',
                format: 'webp',
                quality: 'auto',
                fetch_format: 'auto',
            }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return res.status(500).json({ ok: false, error: 'Error uploading image to Cloudinary' });
                }

                // Return optimized URL with transformations
                const optimizedUrl = result.url.replace('/upload/', '/upload/q_auto,f_auto,w_auto/');
                res.json({ ok: true, imageUrl: optimizedUrl, message: 'Image uploaded successfully' });
            }).end(data);
        })
});
module.exports = router;