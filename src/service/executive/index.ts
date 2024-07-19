import express, {Router} from 'express';
import Approval from "./approval/router"

const serviceExecutive:Router = express();


serviceExecutive.use("/approval", Approval);


export default serviceExecutive;