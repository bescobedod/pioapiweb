import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routers/routers.js';
import { connectionDb } from './configuration/db.js';

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());
app.use('', routes);

app.listen(PORT, () => {
    connectionDb();
    console.log(`Server running on http://localhost:${PORT}`);
});