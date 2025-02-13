import { check, validationResult } from "express-validator";
import { AssignUser, Create, Desactive, Read, UpdateEmployeeContact } from "../models/Employees.js";

async function CreateEmployee(req, res, next) {
    try {
        //verificar que los datos vengan correctamente
        await check('email').isEmail().withMessage('Debes ingresar tu email').run(req);
        await check('address').isLength({max:300}).withMessage('Tu dirección no puede tener más de 300 caracteres').run(req);
        //validamos los números de teléfono usando una expresión regular para aceptar números extrangeros
        await check('phone_number').matches(/^\+?[1-9]\d{1,14}$/).withMessage('El número de teléfono no tiene un formato válido').run(req);
        await check('employee_name').isLength({max:50}).withMessage('Tu nombre no puede tener más de 50 caracteres').run(req);
        await check('employee_lastname').isLength({max:50}).withMessage('Tu apellido no puede tener más de 50 caracteres').run(req);

        const errores = validationResult(req);

        if(!errores.isEmpty()) {
            res.status(400).json({mensaje:'Petición con errores: ', errores});
            return;
        }


        const datos = Object.values(req.body);
        await Create(datos); 
        res.json({mensaje:'inserción correcta'});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

async function UpdateEmployeeUser(req, res, next) {
    try {
        const datos = req.body;
        const id = req.params.id;
        const resultado = await AssignUser(datos, id);
        if (resultado.affectedRows === 0) {
            res.status(404).json({mensaje:"no se encontró el empleado a actualizar"});
        }        
        res.json({mensaje:"Se le ha asignado un nuevo usuario al empleado"});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

async function ReadEmployees(req, res, next) {
    try {
        const employees = await Read();
        res.json({mensaje:'Estos son los empleados: ', employees});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

async function UpdateContact(req, res, next) {
    try {
        //verificar que los datos vengan correctamente
        await check('email').isEmail().withMessage('Debes ingresar tu email').run(req);
        await check('address').isLength({max:300}).withMessage('Tu dirección no puede tener más de 300 caracteres').run(req);
        //validamos los números de teléfono usando una expresión regular para aceptar números extrangeros
        await check('phone_number').matches(/^\+?[1-9]\d{1,14}$/).withMessage('El número de teléfono no tiene un formato válido').run(req);

        const errores = validationResult(req);

        if(!errores.isEmpty()) {
            res.status(400).json({mensaje:'Petición con errores: ', errores});
            return;
        }

        //procesar la solicitud
        const id = req.params.id;
        const resultado = await UpdateEmployeeContact(req.body, id);
        if(resultado.affectedRows === 0){
            res.status(404).json({mensaje:'No se encontró el empleado a actualizar'});
        }
        res.json({mensaje:'Dirección actualizada correctamente'});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

async function DesactiveEmployee(req,res,next) {
    try {
        const id = req.params.id;
        const resultado = await Desactive(id);
        if(resultado.affectedRows === 0){
            res.status(404).json({mensaje:'No se encontró el empleado a desactivar'});
        }
        res.json({mensaje:'Empleado desactivado correctamente'});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

export{
    CreateEmployee,
    UpdateEmployeeUser,
    ReadEmployees,
    UpdateContact,
    DesactiveEmployee
}