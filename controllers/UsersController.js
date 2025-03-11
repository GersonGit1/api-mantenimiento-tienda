import { Create, Delete, Login, Read, UpdateProfile, UpdateRole } from "../models/Users.js";


async function CreateUser(req, res, next) {
    try {
        //validamos que los datos sean correctos
        await check('username').isLength({max:50}).withMessage('Elige un nombre de usuario menos largo').run(req);
        await check('hashed_password').isLength({min:8}).withMessage('La contraseña debe tener al menos 8 caracteres').run(req);
        await check('role_id').isNumeric().withMessage('Debes asignar un rol a este usuario').run(req);

        const errores = validationResult(req);

        if(!errores.isEmpty()) {
            res.status(400).json({mensaje:'Petición con errores: ', errores});
            return;
        }


        const datos = req.body;
        await Create(datos);
        res.json({mensaje:'inserción correcta'});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

async function ReadUsers(req, res, next) {
    try {
        const users = await Read();        
        res.json({mensaje:'estos son los usuarios: ', users});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

async function UpdateUserProfile(req,res,next) {
    try {
        //validamos que los datos sean correctos
        await check('username').isLength({max:50}).withMessage('Elige un nombre de usuario menos largo').run(req);
        await check('hashed_password').isLength({min:8}).withMessage('La contraseña debe tener al menos 8 caracteres').run(req);

        const errores = validationResult(req);

        if(!errores.isEmpty()) {
            res.status(400).json({mensaje:'Petición con errores: ', errores});
            return;
        }

        const id = req.params.id;
        const resultado  = await UpdateProfile(req.body,id);
        if (resultado.affectedRows === 0) {
            res.status(404).json({mensaje:"no se encontró el usuario a actualizar"});
        }        
        res.json({mensaje:"Perfil actualzado"})
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

async function UpdateUserRole(req,res,next) {
    try {
        //validamos que los datos sean correctos
        await check('role_id').isNumeric().withMessage('Debes asignar un rol a este usuario').run(req);

        const errores = validationResult(req);

        if(!errores.isEmpty()) {
            res.status(400).json({mensaje:'Petición con errores: ', errores});
            return;
        }
        //procesamos la solicitud
        const id = req.params.id;
        const resultado = await UpdateRole(req.body,id);
        if (resultado.affectedRows === 0) {
            res.status(404).json({mensaje:"no se encontró el usuario a actualizar"});
        }        
        res.json({mensaje:"Rol actualzado"})
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

async function DeleteUser(req,res,next) {
    try {
        const id = req.params.id;
        const resultado = await Delete(id);
        if (resultado.affectedRows === 0) {
            res.status(404).json({mensaje:"no se encontró el usuario a eliminar"});
        }        
        res.json({mensaje:"Usuario eliminado"})
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

async function AuthenticateUser(req,res,next) {
    try {
        const user = await Login(req.body);
        //verificar si ha ingresado credenciales correctas        
        if (user.length === 0 || user[0].auth == false) {
            res.status(401).json({error:"Usuario o contraseña incorrecto"});
            return;
        }

        //verificar si la cuenta del usuario está activa
        if(user[0].active_user == 0){
            res.status(403).json({error:"La cuenta está inactiva"});
            return;
        }
        
        //si todo está bien procedemos a guardar la información del usuario en la sesion
        req.session.user = {
            id: user[0].id,
            username: user[0].username,
            role_id: user[0].role_id
        }
        res.json({mensaje:"Has iniciado sesión!"});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}
export{
    CreateUser,
    ReadUsers,
    UpdateUserProfile,
    UpdateUserRole,
    DeleteUser,
    AuthenticateUser
}