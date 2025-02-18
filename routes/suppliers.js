import express from "express";
import { CreateSupplier, DesactiveSupplier, ReadSuppliers, UpdateContact } from "../controllers/SuppliersController.js";
import ValidarIdExistente from "../middlewares/registroExiste.js";
import verifySession from "../middlewares/verifySession.js";
const router = express.Router();
//proteger todas las rutas
router.use(verifySession);

router.get("/suppliers", ReadSuppliers)
router.post('/suppliers',CreateSupplier);
router.put('/suppliers/update-contact/:id',ValidarIdExistente('Suppliers'), UpdateContact);
router.put('/suppliers/desactive/:id',ValidarIdExistente('Suppliers'), DesactiveSupplier);

export { router };