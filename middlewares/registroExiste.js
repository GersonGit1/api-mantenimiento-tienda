import pool from "../config/db.js";

function ValidarIdExistente(tabla) {
    return async(req,res,next)=>{
        try {
            const {id} = req.params;

            if(!Number.isInteger(Number(id)) || id <= 0) {
                return res.status(400).json({mensaje:'id no válido'});
            }
    
            const [rows] = await pool.query(`SELECT 1 FROM ${tabla} WHERE id = ?`,[id])
    
            if(rows.length === 0) {
                return res.status(404).json({mensaje:`${tabla} con id ${id} no encontrado`});
            }
    
            next();
        } catch (error) {
            next(error);
        }
    };
};

export default ValidarIdExistente;