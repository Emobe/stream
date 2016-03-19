"use strict";
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
exports.userSchema = new Schema({
    name: {
        first: String,
        last: String
    },
    email: String,
    password: String,
    storageUsed: {
        type: Number,
        default: 0
    },
    apiKey: String,
    resetCode: String,
    activated: {
        type: Boolean,
        default: false
    },
    aCode: String,
    sessID: String,
    sharedFiles: [{ type: Schema.Types.ObjectId, ref: 'File' }],
    home: { type: Schema.Types.ObjectId, ref: 'Folder' }
}, { collection: 'User' });
exports.user = mongoose.model("User", exports.userSchema);
//# sourceMappingURL=user.js.map