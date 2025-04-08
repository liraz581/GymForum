import app from './app';
import dotenv from 'dotenv';
import express from "express";
import path from "path";
import fs from "fs";
import https from "https";

dotenv.config();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} else {
    app.use(express.static(path.join(__dirname, '../front/')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../front/index.html'));
    });
    const prop = {
        key: fs.readFileSync(path.join(__dirname, 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
    }
    https.createServer(prop, app).listen(PORT, () => {
        console.log(`Server is running on secure port ${PORT}`);
    });
}
