import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {router as userRouter} from "./routes/users.js";
import { router as employeeRouter } from "./routes/employees.js";
import { router as supplierRouter } from "./routes/suppliers.js";
import { router as productRouter } from "./routes/products.js";
import { router as productMovementRouter } from "./routes/productMovements.js";
const app = express();

app.use(cors());//permite el ingreso de solicitudes desde un dominio distinto al de la api
app.use(bodyParser.json());//permite interpretar los datos recibidos en formato json
app.use(bodyParser.urlencoded({ extended: true }));//permite recibir y leer datos desde formularios html codificador en URL

app.use('/',userRouter);
app.use('/',employeeRouter);
app.use('/',supplierRouter);
app.use('/',productRouter);
app.use('/',productMovementRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});