"use strict";
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
exports.fileSchema = new Schema({
    name: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    size: Number,
    mime: String,
    path: String,
    extension: String,
    sharing: Boolean,
    icon: String,
    type: String,
    folder: {
        type: Schema.Types.ObjectId,
        ref: 'Folder'
    },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { collection: 'File' });
exports.file = mongoose.model("File", exports.fileSchema);
//# sourceMappingURL=file.js.map