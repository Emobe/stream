"use strict";
const express = require('express');
const fs = require('fs');
let app = express();
app.get('/home', (req, res) => {
    res.sendFile('/public/index.html', { root: __dirname });
});
app.listen(1339, err => {
    console.log('eyey');
});
app.get('/pls', (req, res) => {
    let total = fs.statSync('./ey.mp3').size;
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mp3' });
    fs.createReadStream('./ey.mp3').pipe(res);
});
//# sourceMappingURL=server.js.map