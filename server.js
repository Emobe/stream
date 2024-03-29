"use strict";
const childProcess = require('child_process');
const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const file_1 = require('./models/file');
const mongoose = require('mongoose');
let app = express();
mongoose.connect(process.env.MONGOCON);
app.listen(1339, err => {
    console.log('media stream started');
});
app.get('/media/:type/:fileId/:userId/pre', (req, res) => {
    file_1.file.findById(req.params.fileId, (err, result) => {
        if (result.processed)
            return res.status(200).end();
        else
            return res.status(500).end();
    });
});
app.get('/media/:type/:fileId/:userId/', (req, res) => {
    let cred;
    let fileId, userId, type, path, mime, args;
    try {
        fileId = req.params.fileId;
        userId = req.params.userId;
        type = req.params.type;
    }
    catch (err) {
        return res.status(500).send(err);
    }
    file_1.file.findById(fileId, (err, file) => {
        path = '../data/users/' + userId + '/' + fileId + file.extension;
        let fileStream = fs.createReadStream(path), format = file.extension.substring(1);
        console.log(format);
        switch (type) {
            case 'video':
                mime = 'video/webm';
                args = ['-f', format, '-i', 'pipe:0', '-q:v', '8', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-f', 'webm', 'pipe:1'];
                break;
            case 'audio':
                mime = 'audio/mp3';
                args = ['-f', format, '-i', 'pipe:0', '-f', format, '-q:a', '10', '-vn', '-f', 'mp3', 'pipe:1'];
                break;
            case 'image':
                mime = 'image/png';
                break;
        }
        let convert = childProcess.spawn('ffmpeg', args, { stdio: ['pipe', 'pipe', 'inherit'] });
        let total = fs.statSync(path).size;
        let decipher = crypto.createDecipher('aes-256-ctr', 'test123');
        res.writeHead(200, { 'Transfer-Encoding': 'chunked', 'Content-Length': total, 'Content-Type': mime });
        if (format === "webm" || format === "mp3" || format == "png") {
            fileStream.pipe(decipher).pipe(res);
        }
        else {
            fileStream.pipe(decipher).pipe(convert.stdin);
            convert.stdout.pipe(res);
        }
    });
});
//# sourceMappingURL=server.js.map