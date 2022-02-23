require('dotenv').config();

import "reflect-metadata";
import * as express from 'express';
import * as cors from 'cors';
import * as moment from 'moment-timezone'
import { router } from './src/router';
import { CONFIG } from './src/config';
import { onError } from "./src/common/functions/on-error";
import { ServicesCollection } from "./src/providers";
import { Database } from "./src/data/database-config";
import * as ejs from 'ejs';

console.log('Initializing...');

const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

moment.tz.setDefault('UTC');

ejs.delimiter = '?';
app.set('view engine', 'ejs');
app.set('views', `${process.cwd()}/src/front/views`);

app.use(express.static(`${process.cwd()}/src/front/assets`, {
    lastModified: true,
    etag: false
}));

app.use(router);

ServicesCollection.resolve(Database);

app.use(onError);

app.listen(CONFIG.PORT, CONFIG.HOST, () => {
    console.log(`Running on http://${CONFIG.HOST}:${CONFIG.PORT}`);
});