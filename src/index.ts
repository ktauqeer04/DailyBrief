import express = require('express'); //! import express from 'express';
import dotenv from 'dotenv';
import router from './routes/api';
import fileUpload from 'express-fileupload';
import path from "path";
import cors from "cors";
import helmet from 'helmet';
import { limiter } from './utils/rateLimiter';

dotenv.config()


const PORT = process.env.PORT;

const app = express();


//******************MIDDLEWARES******************************** */
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(helmet());
app.use(cors());
// app.use(limiter);
app.use('/api', router);

//*************************************************************** */

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).json({
        message: "healthy"
    })
    return;
})

app.listen(PORT, () => 
    {console.log(`app is listening at PORT ${PORT}`);
})

 