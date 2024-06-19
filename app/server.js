const express = require("express");
const path = require("path");
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const app = express();
const port = 3000;

// Set up your Azure OpenAI credentials
const endpoint = "https://chat-gpt-a1.openai.azure.com/";
const azureApiKey = "c09f91126e51468d88f57cb83a63ee36";

const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
const deploymentName = "Dalle3";
const n = 1;
const size = "1024x1024";

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    try {
        const results = await client.getImages(deploymentName, prompt, { n, size });
        res.json({ imageUrls: results.data.map(image => image.url) });
    } catch (err) {
        console.error("Error generating image:", err);
        res.status(500).json({ error: "Failed to generate image" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
