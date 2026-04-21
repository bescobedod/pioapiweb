import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routers/routers.js';
import { connectionDb, connectionMongo } from './configuration/db.js';

const app = express();
const PORT = process.env.PORT || 8001;

app.use(helmet());
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('', routes);

app.listen(PORT, () => {
    connectionDb();
    connectionMongo();
    console.log(`Server running on http://localhost:${PORT}`);
});