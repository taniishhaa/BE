const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const MAX_LOG_SIZE = 1 * 1024 * 1024;

app.use((req, res, next) => {
    const logFilePath = path.join(__dirname, 'requests.log');
    const logDetails = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        url: req.originalUrl,
        protocol: req.protocol,
        method: req.method,
        hostname: req.hostname,
        queryParams: req.query,
        headers: req.headers,
        userAgent: req.get('User-Agent') || 'Unknown'
    };

    const logEntry = JSON.stringify(logDetails) + '\n';

    fs.stat(logFilePath, (err, stats) => {
        if (!err && stats.size > MAX_LOG_SIZE) {
            const archivePath = path.join(__dirname, `requests-${Date.now()}.log`);
            fs.rename(logFilePath, archivePath, (err) => {});
        }

        fs.appendFile(logFilePath, logEntry, (err) => {});
    });

    next();
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/test', (req, res) => {
    res.send('Testing logging functionality.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
