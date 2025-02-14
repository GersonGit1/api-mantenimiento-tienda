import pool from "../config/db.js";

 /**CREATE TABLE Product_movements(
	id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    product_id INT,
    movement_type ENUM('ENTRADA','SALIDA'), # este campo solo acepta los valores ENTRADA y SALIDA
    product_movement_date DATETIME,
    quantity INT,
    reason VARCHAR(100),
    FOREIGN KEY (employee_id) REFERENCES Employees(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)

);
 */


//validar que el emleado existe
async function ValidarEmpleadoExistente(data) {
    const employee = await pool.query('SELECT id FROM Employees WHERE id = ?',[data.employee_id]);
    return employee;
}

async function ValidarStockSuficiente(data) {
    const stock = await pool.query('SELECT stock FROM Products WHERE id = ?',[data.product_id]);
    return stock;
}
//crear
async function Create(data) {
    try {
        //validar que el empleado existe
        const employee = await ValidarEmpleadoExistente(data);
        if (employee.length === 0) {
            throw new Error("El empleado que intenta hacer la transacción no existe");
        }
        //validar que no salgan del stock más productos de los que tenemos disponibles
        const stock = await ValidarStockSuficiente(data);
        if (data.movement_type == 'SALIDA' && stock.length < data.quantity) {
            throw new Error("Estock insuficiente para hacer esta transacción");
        }
        //registrar movimiento
        let query ="INSERT INTO Products(employee_id, product_id, movement_type, product_movement_date, quantity, reason) VALUES (?, ?, ?, ?, ?, ?)";
        
        await pool.query(query,data);
        //actualizar stock

        query = data.movement_type == 'SALIDA' ? "UPDATE Products SET stock = stock - ? WHERE id = ?": "UPDATE Products SET stock = stock + ? WHERE id = ?"

        await pool.query(query,[data.quantity,data.product_id]);

    } catch (error) {
        console.error(error);
    }
}
//no tendremos una función para actualizar porque estos registros deben ser inmutables
//en caso de un error grave, deberá notificarse a la administración para que hagan la 
//corrección directamente desde la base de datos

//leer los registros

export{
    Create
}