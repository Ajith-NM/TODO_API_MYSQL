import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import cookieParser from "cookie-parser";
import { sequelize } from "./config/DB_connection.js";
import userRouter from "./routes/userRouter.js";
import taskRouter from "./routes/taskRouter.js";


const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

// DB Config
await sequelize.authenticate()
    .then(() => { console.log('Connection has been established successfully.') })
    .catch((error) => { console.error('Unable to connect to the database:', error) })

await sequelize.sync({ force: false })
    .then(() => { console.log("syncing successful") })
    .catch((error) => { console.error("error in syncing", error) })


// router
app.use("/user", userRouter)
app.use("/task", taskRouter)


app.listen(4001, () => console.log("server running"))