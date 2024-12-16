import express = require('express'); //! import express from 'express';
import dotenv from 'dotenv';
import router from './routers/api';
import fileUpload from 'express-fileupload';
import path from "path";
import cors from "cors";
import helmet from 'helmet';
import { limiter } from './utils/rateLimiter';

dotenv.config()
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use('/api', router);

app.listen(3000, () => {console.log(`app is listening at PORT 3000`);
})

 