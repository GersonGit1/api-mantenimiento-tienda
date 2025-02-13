import express from "express";
import { CreateUser, DeleteUser, ReadUsers, UpdateUserProfile, UpdateUserRole } from "../controllers/UsersController.js";
import ValidarIdExistente from "../middlewares/registroExiste.js";

const router = express.Router();

router.get('/users',ReadUsers);
router.post('/users',CreateUser);
router.put('/users/update-profile/:id',ValidarIdExistente('Users'), UpdateUserProfile);
router.put('/users/update-role/:id',ValidarIdExistente('Users'), UpdateUserRole);
router.delete('/users/:id',ValidarIdExistente('Users'), DeleteUser);

export  {router};