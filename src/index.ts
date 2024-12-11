import express = require('express'); //! import express from 'express';
import { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config()

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get('/route', (req: Request, res: Response) => {
    res.status(200).json("working again")
})

app.listen(3000, () => {console.log(`app is listening at PORT 3000`);
})

