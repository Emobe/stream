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
        let fileStream = fs.createReadStream(path);
        console.log(path);
        switch (type) {
            case 'audio':
                mime = 'audio/mp3';
                args = ['pipe:0', '-q:v', '5', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-f', 'webm', 'pipe:1'];
                break;
            case 'video':
                mime = 'video/webm';
                args = ['-i', path, '-q:a', '8', '-vn', '-f', 'mp3', 'pipe:1'];
                break;
            case 'image':
                mime = 'image/jpeg';
                break;
        }
        let convert = childProcess.spawn('ffmpeg', args, { stdio: ['pipe', 'pipe', 'inherit'] });
        let total = fs.statSync(path).size;
        let decipher = crypto.createDecipher('aes-256-ctr', 'test123');
        res.writeHead(200, { 'Content-Length': total, 'Content-Type': mime });
        fileStream.pipe(convert.stdin);
        convert.stdout.pipe(decipher).pipe(res);
    });
});
//# sourceMappingURL=server.js.map