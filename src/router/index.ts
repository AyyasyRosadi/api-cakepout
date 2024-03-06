import express, { Router } from 'express';
import service from '../services';
const routes: Router = express();

routes.use('', service);

export default routes;