import express from "express";
import { CreateProductMovement, ReadProductMovements } from "../controllers/ProductMovementsController.js";
import ValidarIdExistente from "../middlewares/registroExiste.js";
import verifySession from "../middlewares/verifySession.js";
const router = express.Router();
//proteger todas las rutas
router.use(verifySession);

router.post('/product-movements/:id',ValidarIdExistente('Products'), CreateProductMovement);
router.get('/product-movements',ReadProductMovements);

export {router};