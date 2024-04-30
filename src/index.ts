import { Synchronize } from "./config/synchronize"
import app from "./server"


app.listen(9191, async () => {
    try {
        await Synchronize()
        console.log(`Hello iam running on port: 9191`)
    } catch (err) {
        console.log(err)
    }
})






