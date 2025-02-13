import pool from "../config/db.js";

//añadir proveedores
async function Create(data) {

    let query ="INSERT INTO Suppliers(company_name, phone_number, email, address) VALUES (?, ?, ?, ?)";
    const [supplier]= await pool.query(query,data);
    console.log(`Se ha insertado ${supplier}`);
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
    const [updatedSupplier] = await pool.query("UPDATE Suppliers SET phone_number = ?, email = ?, address = ? WHERE id = ?",supplier);
    return updatedSupplier;
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