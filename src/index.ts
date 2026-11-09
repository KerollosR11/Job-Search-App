import { bootstrap } from "./app.controller";


bootstrap().catch(
    (error :unknown)=>{
        console.log("Faild to start the Application ", error);
    }
)