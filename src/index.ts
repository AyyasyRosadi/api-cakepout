import express, { Application, json } from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import { Synchronize } from "./config/synchronize";
import { cache } from "./middleware/cache";
import routes from "./service";


const app: Application = express();

app.use(cache)
app.use(json())
app.use(cors())
app.use(morgan('dev'))
app.use(compression())
app.use(helmet())

app.use(routes)


app.listen(9191, async () => {
    try {
        await Synchronize()
        console.log(`Hello iam running on port: 9191`)
    } catch (err) {
        console.log(err)
    }
})


