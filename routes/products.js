import express from "express";
import { ChangeState, CreateProducts, ReadProducts, UpdateProductInfo } from "../controllers/ProductsController.js";
import ValidarIdExistente from "../middlewares/registroExiste.js";
import verifySession from "../middlewares/verifySession.js";
const router = express.Router();
//proteger todas las rutas
router.use(verifySession);

router.get('/products',ReadProducts);
router.post("/products",CreateProducts);
router.put("/products/:id",ValidarIdExistente('Products'), UpdateProductInfo);
router.put("/products/state/:id",ValidarIdExistente('Products'), ChangeState);

export {router};