const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

// ✅ Enable CORS for all requests
app.use(cors());

// ✅ Allow specific origins (if needed)
app.use(cors({
    origin: ['https://wayansuantika.github.io'], // Your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Your existing routes...
app.post('/analyze', async (req, res) => {
    try {
        const url = req.body.url;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        // Your SEO analysis logic here...
        res.json({ success: true, message: 'SEO analysis completed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to analyze' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
