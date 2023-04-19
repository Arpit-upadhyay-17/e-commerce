import express from "express";
import dotenv from "dotenv";
import Myrouter from "./src/Routes/Routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "./src/Db/Db.js";

dotenv.config();
const app = express();

app.use( cors() );
app.use( cookieParser() )
app.use( express.json() )
app.use( express.urlencoded({extended : true}) )
app.use("/api" , Myrouter )

connection().then(result => {
    console.log("Mongodb is connected");
}).catch((err) => {
    return console.log(err);
})




app.get("/" , (request , response) => {
    return response.status(200).send("<h1>Hello this is Working</h1>")
})

app.listen( process.env.PORT , () => {
    console.log(`App is running on port : ${process.env.PORT}`);
})

