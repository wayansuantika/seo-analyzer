const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(cors()); // Enable CORS

app.get("/", (req, res) => {
    res.send("SEO Analyzer API is running!");
});

// SEO Analysis Route
app.get("/analyze", async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        // Fetch the website content
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Extract SEO details
        const title = $("title").text();
        const description = $('meta[name="description"]').attr("content") || "No description found";
        const h1 = $("h1").text() || "No H1 tag found";

        res.json({ title, description, h1 });
    } catch (error) {
        res.status(500).json({ error: "Failed to analyze the website" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
