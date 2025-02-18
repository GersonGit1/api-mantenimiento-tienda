import express from "express";
import { AuthenticateUser, CreateUser, DeleteUser, ReadUsers, UpdateUserProfile, UpdateUserRole } from "../controllers/UsersController.js";
import ValidarIdExistente from "../middlewares/registroExiste.js";
import verifySession from "../middlewares/verifySession.js";

const router = express.Router();
//esta es una ruta pública porque cualquiera puede acceder a esta ruta sin estar autenticado
//por eso no protegemos esta ruta
router.post("/users/login",AuthenticateUser);

//ahora sí protegemos todas las rutas que necesitan que el usuario esté autenticado
router.use(verifySession);

router.get('/users',ReadUsers);
router.post('/users',CreateUser);
router.put('/users/update-profile/:id',ValidarIdExistente('Users'), UpdateUserProfile);
router.put('/users/update-role/:id',ValidarIdExistente('Users'), UpdateUserRole);
router.delete('/users/:id',ValidarIdExistente('Users'), DeleteUser);

//cerrar sesion
router.get('/users/logout',(req,res)=>{
    req.session.destroy((error)=>{
        if(error){
            return res.status(500).json({error:"Error al cerrar sesion"});
        }
        res.json({mensaje:"Se ha cerrado la sesion"});
    });
});
//ruta de prueba para verificar la sesion
//router.get('/users/verify-session');

export  {router};