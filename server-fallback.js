const express = require('express');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 8080;

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Basic API info endpoint
app.get('/api/secrets', (req, res) => {
    res.json({ success: true, BASE_URL: process.env.BASE_URL || 'https://documents-225250995708.europe-west1.run.app/api' });
});

// Start server
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
    console.log(`Fallback server started on port ${PORT}`);
    console.log('Health check available at /api/health');
});
