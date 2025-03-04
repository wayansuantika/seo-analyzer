const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(cors()); // Enable CORS for all requests

// ✅ Add a default route to check if the server is running
app.get("/", (req, res) => {
    res.send("SEO Analyzer API is running!");
});

// ✅ Main SEO Analysis Route
app.get("/analyze", async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        // Fetch website content
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Extract SEO elements
        const title = $("title").text();
        const description = $('meta[name="description"]').attr("content") || "No description found";
        const h1 = $("h1").text() || "No H1 tag found";

        res.json({ title, description, h1 });
    } catch (error) {
        res.status(500).json({ error: "Failed to analyze the website" });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
