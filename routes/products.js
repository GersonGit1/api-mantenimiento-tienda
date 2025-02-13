import express from "express";
import { CreateProducts, DesactiveProduct, ReadProducts, UpdateProductInfo } from "../controllers/ProductsController.js";
import ValidarIdExistente from "../middlewares/registroExiste.js";
const router = express.Router();

router.get('/products',ReadProducts);
router.post("/products",CreateProducts);
router.put("/products/:id",ValidarIdExistente('Products'), UpdateProductInfo);
router.put("/products/desactive/:id",ValidarIdExistente('Products'), DesactiveProduct);

export {router};