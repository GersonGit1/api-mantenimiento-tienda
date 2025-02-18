import express from "express";
import { CreateProductMovement, ReadProductMovements } from "../controllers/ProductMovementsController.js";
import ValidarIdExistente from "../middlewares/registroExiste.js";
const router = express.Router();

router.post('/product-movements/:id',ValidarIdExistente('Products'), CreateProductMovement);
router.get('/product-movements',ReadProductMovements);

export {router};