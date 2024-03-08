import authRoutes  from './routers/authRoutes';
import express  from 'express';
import bodyparser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser'
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import docRoutes from './routers/docRoutes';
import logger from './utils/logger';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors({
    credentials: true
}));


app.use(compression());
app.use(bodyparser.json());
app.use(cookieParser());

export const staticFilesPath = path.join(__dirname, './uploads');
app.use('src/uploads', express.static(staticFilesPath));

app.use(cors({
    credentials:true,
    origin:["http://localhost:2323"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}))

app.use("/auth",authRoutes)
app.use("/docman",docRoutes)

const server = http.createServer(app);

server.listen((process.env.PORT), () => {
    logger.info(`Server is running http://0.0.0.0:${process.env.PORT}/`);
});


