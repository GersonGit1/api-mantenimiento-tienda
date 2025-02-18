import pool from "../config/db.js";

//validar que el emleado existe
async function ValidarEmpleadoExistente(data) {
    const employee = await pool.query('SELECT id FROM Employees WHERE id = ?',[data.employee_id]);
    //retornamos el primer elemento del array porque es el que contiene los datos de la consulta
    return employee[0];
}

async function ValidarStockSuficiente(data) {
    const stock = await pool.query('SELECT stock FROM Products WHERE id = ?',[data.product_id]);
    return stock;
}
//crear
async function Create(data, id) {
    try {
        
        //registrar movimiento
        let query ="INSERT INTO Product_movements(product_id, employee_id, movement_type, product_movement_date, quantity, reason) VALUES (?, ?, ?, ?, ?, ?)";
        let datos = Object.values(data);
        //agregar el id al inicio del array que se va a leer al pasar los argumentos de la consulta SQL
        datos.unshift(id);
        
        const [movimiento] = await pool.query(query,datos);
        //actualizar stock
        query = data.movement_type == 'SALIDA' ? "": ""
        if (data.movement_type == 'SALIDA') {
            query = "UPDATE Products SET stock = stock - ? WHERE id = ?";
        } else if(data.movement_type == 'ENTRADA'){
            query = "UPDATE Products SET stock = stock + ? WHERE id = ?";
        }
                
        const [stockActualizado] = await pool.query(query,[data.quantity,id]);

        return [movimiento,stockActualizado,]
    } catch (error) {
        console.error(error);
        return;
    }
}
//no tendremos una función para actualizar porque estos registros deben ser inmutables
//en caso de un error grave, deberá notificarse a la administración para que hagan la 
//corrección directamente desde la base de datos

//leer los registros
async function Read() {
    const [producto_movement] = await pool.query("SELECT id, employee_id, product_id, movement_type, product_movement_date, quantity, reason FROM Product_movements");
    return producto_movement;
}

export{
    Create,
    Read,
    ValidarEmpleadoExistente,
    ValidarStockSuficiente
}