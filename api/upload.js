const axios = require('axios');
const multer = require('multer');
const fs = require('fs');

// Set up multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() }).single('image'); 

module.exports = (req, res) => {
    // Handle file upload
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading file' });
        }

        const image = req.file.buffer.toString('base64');
        
        // Send image to Roboflow for inference
        axios.post('https://serverless.roboflow.com/rice-plant-leaf-disease-classification/1', {
            api_key: 'YOUR_ROBOFLOW_API_KEY',
            data: image
        })
        .then((response) => {
            res.status(200).json({ prediction: response.data });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error occurred while processing the image' });
        });
    });
};
