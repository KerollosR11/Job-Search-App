import express, {Express, Request, Response} from "express";
import connectDB from "./DB/DBconnection";
import helmet from "helmet";
import cors from "cors";
import { corsOptions } from "./Utils/corsOptions";
import { env } from "./Config/config.service";
import { limitter } from "./Utils/rateLimitter";
import { authRouter, userRouter } from "./Modules/index";
import { globalErrorHandling } from "./Utils/Response/error.response";


export const bootstrap =async () :Promise<void>=>{
    const app :Express = express();
    app.use(express.json());

    await connectDB();

    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/user", userRouter);

    app.use(helmet(), limitter, cors(corsOptions));

    app.get("/", (req :Request ,res :Response)=>{
        return res.status(200).json({message: "Welcome to home page"})
    });

    app.all("/*dummy", (req, res)=>{
        return res.status(404).json({message: "Not found Handler"})
    });

    app.use(globalErrorHandling);


    app.listen(env.PORT, ()=>{
        console.log(`Server is Running on port ${env.PORT}`);
    });
}