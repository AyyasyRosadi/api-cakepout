import express, { Router } from "express";
import ListLembagaApakah from './instance/router';
import Program from "./program/router"


const serviceApakah: Router = express();

serviceApakah.use("/list-lembaga-apakah", ListLembagaApakah)
serviceApakah.use("/program", Program)

export default serviceApakah;