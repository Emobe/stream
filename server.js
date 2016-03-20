"use strict";
const childProcess = require('child_process');
const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
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
        path = '../data/users/' + userId + '/previews/' + type + '/' + fileId;
    }
    catch (err) {
        return res.status(500).send(err);
    }
    switch (type) {
        case 'audio':
            mime = 'audio/mp3';
            args = ['-i', path, '-q:v', '5', 'c:v', 'libvpx', '-f', 'webm', 'pipe:1'];
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
    let file = fs.createReadStream(path);
    let total = fs.statSync(path).size;
    let decipher = crypto.createDecipher('aes-256-ctr', 'test123');
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': mime });
    convert.stdout.pipe(decipher).pipe(res);
});
//# sourceMappingURL=server.js.map