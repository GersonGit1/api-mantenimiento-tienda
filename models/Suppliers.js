import pool from "../config/db.js";

//añadir proveedores
async function Create(data) {

    //ejecutamos un procedimiendo almacenado de la base de datos
    let query ="CALL insert_and_select_supplier(?, ?, ?, ?)";
    const [supplier] = await pool.query(query,data); //insertamos al nuevo proveedor y recibimos el registro recién insertado
    const sup = supplier[0];
    //devolver únicamente el objeto con la información del registro recién agregado
    return sup[0];
}

//mostrar empleados
async function Read() {
    const [suppliers] = await pool.query("SELECT id, company_name, phone_number, email, address FROM Suppliers WHERE active_supplier = 1");
    return suppliers;
}

//actualizar el contacto del proveedor
async function UpdateSupplierContact(data,id) {
    let supplier = Object.values(data);
    supplier.push(id);
    const connection = await pool.getConnection();//obtnemos una conexión del pool de conexiones y la usamos especialmente para la transacción siguiente
    try {
        await connection.beginTransaction();//iniciamos la transacción
        await connection.query("UPDATE Suppliers SET phone_number = ?, email = ?, address = ? WHERE id = ?",supplier);
        const [updatedSupplier] = await connection.query("SELECT * FROM Suppliers WHERE id = ?",id)
        return updatedSupplier; 
    } catch (error) {
        await connection.rollback(); // rebertir cambios si hay error
        console.log(error);
    }finally{
        connection.release();//liberamos la conexión
    }
    
}

//probar esta función hasta que esté listo el campo active_supplier en la bd
async function Desactive(id) {
    const data = [false,id];
    const [employee] = await pool.query("UPDATE Suppliers SET active_supplier = ? WHERE id = ?",data)
    return employee;
}
export{
    Create,
    Read,
    UpdateSupplierContact,
    Desactive
}