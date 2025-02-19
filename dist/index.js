"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express"); //! import express from 'express';
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./routes/api"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
dotenv_1.default.config();
const PORT = process.env.PORT;
const app = express();
//******************MIDDLEWARES******************************** */
app.use(express.json());
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 }
}));
app.use('/public', express.static(path_1.default.join(__dirname, '/public')));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// app.use(limiter);
app.use('/api', api_1.default);
//*************************************************************** */
app.get('/', (req, res) => {
    res.status(200).json({
        message: "healthy"
    });
    return;
});
app.listen(PORT, () => {
    console.log(`app is listening at PORT ${PORT}`);
});
