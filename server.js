"use strict";
const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');
let app = express();
mongoose.connect(process.env.MONGOCON);
app.listen(1339, err => {
    console.log('media stream started');
});
app.get('/media/:type/:fileId/:user/:userIdId', (req, res) => {
    let cred;
    let fileId, userId, type, path;
    try {
        fileId = req.params.fileId;
        userId = req.params.userId;
        type = req.params.type;
    }
    catch (err) {
        return res.status(500).send(err);
    }
    path = '../data/users/' + userId + '/previews/' + type + '/' + fileId;
    let file = fs.createReadStream(path);
    let total = fs.statSync(path).size;
    let decipher = crypto.createDecipher('aes-256-ctr', 'test123');
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mp3' });
    file.pipe(decipher).pipe(res);
});
//# sourceMappingURL=server.js.map