import { check, validationResult } from "express-validator";
import { Create, Read, UpdateInfo, UpdateState, ValidarIdExistente } from "../models/Products.js";

async function CreateProducts(req, res, next) {
    try {
        //verificar que los datos vengan correctamente
        await check('supplier_id').isInt({min:0}).withMessage('El id del proveedor debe ser un entero positivo').custom(async (value)=>{ 
            const supplier = await ValidarIdExistente(value)
            if(!supplier){
                throw new Error("El proveedor no existe o está inactivo");
            }}).run(req);
        await check('product_name').isLength({max:40}).withMessage('El nombre del producto no puede tener más de 40 caracteres').run(req);
        //aceptar números decimales y rechazar negativos
        await check('price').isFloat({min:0}).withMessage('ingresa un precio válido').run(req);
        //permitir sólo enteros y evitar negativos
        await check('stock').isInt({min:0}).withMessage('El stock debe ser un número entero positivo').run(req);

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

async function ReadProducts(req, res, next) {
    //obtenemos el número de página que se está solicitando
    const {pag} = req.query;
    try {
        const [registros,total] = await Read(pag);
        res.status(200).json({mensaje:'Estos son los productos: ', registros, total});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

async function UpdateProductInfo(req, res, next) {
    try {
        //verificar que los datos vengan correctamente
        await check('product_name').isLength({max:40}).withMessage('El nombre del producto no puede tener más de 40 caracteres').run(req);
        //aceptar números decimales y rechazar negativos
        await check('price').isFloat({min:0}).withMessage('ingresa un precio válido').run(req);

        const errores = validationResult(req);

        if(!errores.isEmpty()) {
            res.status(400).json({mensaje:'Petición con errores: ', errores});
            return;
        }

        //procesar la solicitud
        const id = req.params.id;
        const resultado = await UpdateInfo(req.body, id);
        if(resultado.affectedRows === 0){
            res.status(404).json({mensaje:'No se encontró el producto a actualizar'});
        }
        res.json({mensaje:'Datos de contacto actualizados correctamente'});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next(error);
    }
}

async function ChangeState(req,res,next) {
    try {
        const id = req.params.id;
        const state = req.body.state;
        
        const resultado = await UpdateState(id,state);
        if(resultado.affectedRows === 0){
           return res.status(404).json({mensaje:'No se encontró el producto a desactivar'});
        }
        // si el state viene como 0 significa que quieren poner a la venta el producto porque quieren cambiar su estado
        //de 0 a 1. por eso si el código llega hasta aquí significa que el producto ya está como 1; o veceversa
        const active = state == "0"? true:false;
        return res.status(200).json({mensaje:'Estado modificado correctamente', active, resultado});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next(error);
    }
}

export {
    CreateProducts,
    ReadProducts,
    UpdateProductInfo,
    ChangeState
}