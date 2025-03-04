'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import adminRoutes from '../src/administrators/administrator.routes.js';
import { createAdmin } from '../src/administrators/administrator.controller.js';
import companyRoutes from '../src/companies/companies.routes.js';
import clientRoutes from '../src/clients/client.route.js';


const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
}

const routes = (app) => {
    app.use('/COPEREX/v1/admins', adminRoutes)
    app.use('/COPEREX/v1/companies', companyRoutes)
    app.use('/COPEREX/v1/clients', clientRoutes)
};

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Database connection successful!!');
        await createAdmin();
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(`Server init failded: ${error}`);
    }
}