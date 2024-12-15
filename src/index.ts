import express = require('express'); //! import express from 'express';
import dotenv from 'dotenv';
import router from './routers/api';
import fileUpload from 'express-fileupload';
import path from "path";

dotenv.config()
console.log(`port is ${process.env.PORT}`);
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}))
app.use('/public', express.static(path.join(__dirname, '/public')))

app.use('/api', router);

app.listen(3000, () => {console.log(`app is listening at PORT 3000`);
})

 