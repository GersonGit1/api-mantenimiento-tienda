import { check, validationResult } from "express-validator";
import { Create, Read, UpdateSupplierContact, Desactive } from "../models/Suppliers.js";


async function CreateSupplier(req, res, next) {
    try {        
        //verificar que los datos vengan correctamente
        await check('email').isEmail().withMessage('Debes ingresar tu email').run(req);
        await check('address').isLength({max:300}).withMessage('Tu dirección no puede tener más de 300 caracteres').run(req);
        //validamos los números de teléfono usando una expresión regular para aceptar números extrangeros
        await check('phone_number').matches(/^\+?[1-9]\d{1,14}$/).withMessage('El número de teléfono no tiene un formato válido').run(req);
        await check('company_name').isLength({max:50}).withMessage('El nombre de la empresa no puede tener más de 50 caracteres').run(req);

        const errores = validationResult(req);

        if(!errores.isEmpty()) {
            res.status(400).json({mensaje:'Petición con errores: ', errores});
            return;
        }


        const datos = Object.values(req.body);
        const supplier = await Create(datos); 
        console.log(supplier);
        
        res.json({mensaje:'inserción correcta', supplier});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

async function ReadSuppliers(req, res, next) {
    try {
        //obtenemos el número de página que se está solicitando
        const {pag} = req.query;
        const [registros,total] = await Read(pag);
        res.json({mensaje:'Estos son los proveedores: ', registros,total});
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
            return res.status(400).json({mensaje:'Petición con errores: ', errores});
        }

        //procesar la solicitud
        const id = req.params.id;
        const resultado = await UpdateSupplierContact(req.body, id);
        res.json({mensaje:'Datos de contacto actualizados correctamente',resultado});
    } catch (error) {
        res.status(500).send("error en el servidor");
        next(error);
    }
}

async function DesactiveSupplier(req,res,next) {
    try {
        const id = req.params.id;
        const resultado = await Desactive(id);
        if(resultado.affectedRows === 0){
            res.status(404).json({mensaje:'No se encontró el proveedor a desactivar'});
        }
        res.json({mensaje:'Proveedor desactivado correctamente'});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next(error);
    }
}
export{
    CreateSupplier,
    ReadSuppliers,
    UpdateContact,
    DesactiveSupplier
}