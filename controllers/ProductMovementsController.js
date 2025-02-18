import { check, validationResult } from "express-validator";
import { Create, Read, ValidarEmpleadoExistente, ValidarStockSuficiente } from "../models/ProductMovements.js";

async function CreateProductMovement(req,res,next) {
    try {
        await check('employee_id').isInt().withMessage("Ingresa un id de empleado válido").run(req);
        await check('movement_type').isIn(['SALIDA','ENTRADA']).withMessage("Debes especificar si el movimiento es ENTRADA o SALIDA de productos").run(req);
        await check('reason').isLength({max:100}).withMessage("Solo puedes ingresar hasta 100 caracteres").run(req);

        const errores = validationResult(req);

        if(!errores.isEmpty()) {
            res.status(400).json({mensaje:'Petición con errores: ', errores});
            return;
        }

        const {id} = req.params;
        const data = req.body;
        //validar que el empleado existe

        const employee = await ValidarEmpleadoExistente(data);        
        if (employee.length === 0) {
            res.json({error:"El empleado que intenta hacer la transacción no existe"});
            return;
        }

        //validar que haya especificado 'SALIDA' o 'ENTRADA' en el tipo de movimiento
        if(data.movement_type != 'SALIDA' && data.movement_type != 'ENTRADA'){
            res.json({error:"Debe especificar si el movimiento es ENTRADA o SALIDA de productos"});
            return;
        }
        //validar que no salgan del stock más productos de los que tenemos disponibles
        const stock = await ValidarStockSuficiente(data);
        if (data.movement_type == 'SALIDA' && stock.length < data.quantity) {
            res.json({error:"Estock insuficiente para hacer esta transacción"});
            return;
        } 

        //registrar el movimiento
        const resultado = await Create(req.body, id);
        console.log(resultado);
        res.json({mensaje:'inserción correcta'});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

async function ReadProductMovements(req,res,next) {
    try {
        const productMovements = await Read();
        res.json({mensaje:'estos son los movimientos de los productos: ', productMovements});
    } catch (error) {
        console.error(error);
        res.status(500).send("error en el servidor");
        next();
    }
}

export {
    CreateProductMovement,
    ReadProductMovements
}