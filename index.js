import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import dotenv from "dotenv";
import {router as userRouter} from "./routes/users.js";
import { router as employeeRouter } from "./routes/employees.js";
import { router as supplierRouter } from "./routes/suppliers.js";
import { router as productRouter } from "./routes/products.js";
import { router as productMovementRouter } from "./routes/productMovements.js";
const app = express();
dotenv.config({path: ".env"});

//permitir el ingreso de solicitudes desde un dominio distinto al de la api
app.use(cors({
    origin: "http://localhost:4000", //la api sólo acepta peticiones desde este dominio
    credentials: true //permite el envío de cookies
}));

app.use(bodyParser.json());//permite interpretar los datos recibidos en formato json
app.use(bodyParser.urlencoded({ extended: true }));//permite recibir y leer datos desde formularios html codificador en URL

//configuración de la sesion
app.use(session({
    secret: process.env.SECRET,
    resave: false,//evita que la sesion se guarde si no se modifica
    saveUninitialized: false,//no guarda sesiones nuevas sin inicializar
    cookie:{
        maxAge: 1000 * 60 * 60,//1 hora
        httpOnly: true,//la cookie no puede ser accedida desde el cliente
        secure: false,//cuando usemos https cambiamos este valor a true
    }
}));
//enrutamiento
app.use('/',userRouter);
app.use('/',employeeRouter);
app.use('/',supplierRouter);
app.use('/',productRouter);
app.use('/',productMovementRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});