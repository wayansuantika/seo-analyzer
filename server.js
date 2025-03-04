// server.js (Backend for SEO Analyzer)
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY;

app.use(express.json());
app.use(express.static("public")); // Serve frontend files

// Function to fetch website HTML
async function fetchHTML(url) {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (error) {
        throw new Error("Failed to fetch website HTML.");
    }
}

// Function to analyze meta tags
function analyzeMetaTags(html) {
    const $ = cheerio.load(html);
    return {
        title: $("title").text() || "Missing Title Tag",
        description: $('meta[name="description"]').attr("content") || "Missing Meta Description",
        keywords: $('meta[name="keywords"]').attr("content") || "No Meta Keywords Found"
    };
}

// Function to check headings structure
function analyzeHeadings(html) {
    const $ = cheerio.load(html);
    return {
        h1: $("h1").length,
        h2: $("h2").length,
        h3: $("h3").length,
    };
}

// Function to check image alt attributes
function analyzeImages(html) {
    const $ = cheerio.load(html);
    const images = $("img");
    let missingAltCount = 0;

    images.each((_, img) => {
        if (!$(img).attr("alt")) missingAltCount++;
    });

    return { totalImages: images.length, missingAlt: missingAltCount };
}

// Fetch Google PageSpeed Insights
async function analyzePageSpeed(url) {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${PAGESPEED_API_KEY}`
        );
        return response.data.lighthouseResult.categories.performance.score * 100;
    } catch (error) {
        return "Failed to fetch PageSpeed data.";
    }
}

// API Route for SEO Analysis
app.post("/analyze", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required." });

    try {
        const html = await fetchHTML(url);
        const metaTags = analyzeMetaTags(html);
        const headings = analyzeHeadings(html);
        const images = analyzeImages(html);
        const pageSpeed = await analyzePageSpeed(url);

        res.json({ metaTags, headings, images, pageSpeed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
