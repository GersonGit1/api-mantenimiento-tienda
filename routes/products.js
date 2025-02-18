import express from "express";
import { CreateProducts, DesactiveProduct, ReadProducts, UpdateProductInfo } from "../controllers/ProductsController.js";
import ValidarIdExistente from "../middlewares/registroExiste.js";
import verifySession from "../middlewares/verifySession.js";
const router = express.Router();
//proteger todas las rutas
router.use(verifySession);

router.get('/products',ReadProducts);
router.post("/products",CreateProducts);
router.put("/products/:id",ValidarIdExistente('Products'), UpdateProductInfo);
router.put("/products/desactive/:id",ValidarIdExistente('Products'), DesactiveProduct);

export {router};