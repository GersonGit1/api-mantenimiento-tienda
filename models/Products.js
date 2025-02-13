import pool from "../config/db.js";

//añadir productos

async function ValidarIdExistente(id) {
    const [rows] = await pool.query("SELECT id FROM Suppliers WHERE id = ? AND active_supplier = 1",[id]);
    return rows.length > 0; //devuelve true o false según sean los registros válidos que el cliente haya ingresado
}

async function Create(data) {

    let query ="INSERT INTO Products(supplier_id, product_name, price, stock) VALUES (?, ?, ?, ?)";
    const [product]= await pool.query(query,data);
    console.log(`Se ha insertado ${product}`);
}

//mostrar productos
async function Read() {
    const [products] = await pool.query("SELECT id, product_name, price, stock FROM Products WHERE active_product = 1");
    return products;
}

async function UpdateInfo(data,id) {
    let product = Object.values(data);
    product.push(id);
    const [updatedProduct] = await pool.query("UPDATE Products SET product_name = ?, price = ? WHERE id = ?",product);
    return updatedProduct;
}

//probar esta función hasta que esté listo el campo active_product en la bd
async function Desactive(id) {
    const data = [false,id];
    const [product] = await pool.query("UPDATE Products SET active_product = ? WHERE id = ?",data)
    return product;
}
export{
    ValidarIdExistente,
    Create,
    Read,
    UpdateInfo,
    Desactive
}