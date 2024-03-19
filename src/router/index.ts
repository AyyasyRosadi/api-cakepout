import express, { Router } from 'express';
import service from '../service';
const routes: Router = express();

routes.use('', service);

export default routes;