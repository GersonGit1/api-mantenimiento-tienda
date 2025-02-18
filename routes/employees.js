import express from "express";
import { CreateEmployee, DesactiveEmployee, ReadEmployees, UpdateContact, UpdateEmployeeUser } from "../controllers/EmployeesController.js";
import ValidarIdExistente from "../middlewares/registroExiste.js";
import verifySession from "../middlewares/verifySession.js";
const router = express.Router();
//proteger todas las rutas
router.use(verifySession);

router.get("/employees", ReadEmployees)
router.post('/employees',CreateEmployee);
router.put('/employees/update-user/:id',ValidarIdExistente('Employees'), UpdateEmployeeUser);
router.put('/employees/update-contact/:id',ValidarIdExistente('Employees'), UpdateContact);
router.put('/employees/desactive/:id',ValidarIdExistente('Employees'), DesactiveEmployee);

export { router };