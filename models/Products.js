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
async function Read(pagina) {
    const connection = await pool.getConnection();
    try {
        //calculamos los registros que se va a saltar la consulta dependiendo de la página que se solicite
        const registrosPorPagina = 10;
        const offset = registrosPorPagina * (pagina - 1);
        const query =`SELECT p.id, p.product_name, p.price, p.stock, p.active_product, s.company_name 
                    FROM Products p join Suppliers s on p.supplier_id = s.id LIMIT 10 OFFSET ${offset}`;
        const [products] = await pool.query(query);
        const [total] = await pool.query("SELECT COUNT(*) as total FROM Products");
        
        return [products, total];
    } catch (error) {
        await connection.rollback(); // rebertir cambios si hay error
        console.log(error);
    }finally{
        connection.release();
    }

    
}

async function UpdateInfo(data,id) {
    let product = Object.values(data);
    product.push(id);
    const [updatedProduct] = await pool.query("UPDATE Products SET product_name = ?, price = ? WHERE id = ?",product);
    return updatedProduct;
}

async function UpdateState(id,state) {
    //si el estado viene como 0 significa que el producto está inactivo y el usuario quiero activarlo 
    //por eso en la base de datos vamos a insertar true para que esté activo; de lo contrario insertamos false
    //porque significa que el producto está activo y quieren desactivarlo
    state == "0"? state = true: state = false;
    const data = [state,id];
    //realizar un transaction en mysql para actualizar el estado del producto y luego devolver el producto actualizado
    const connection = await pool.getConnection(); //obtiene una conexión especial del pool de conexiones para poder ejecutar más de una
                                                    //consulta dentro de la misma conexion
    try {
        await connection.beginTransaction(); //indicamos que las siguientes consultas estás dentro de una transacción              
        await pool.query("UPDATE Products SET active_product = ? WHERE id = ?",data)
        const [product] = await connection.query("SELECT * from Products WHERE id = ?",[id]);
        await connection.commit();//confirmamos los cambios en la BD
        console.log(product);
    
        return product;
    } catch (error) {
        await connection.rollback(); // rebertir cambios si hay error
        console.log(error);
    } finally {
        connection.release(); //liberar la conexión
    }

}
export{
    ValidarIdExistente,
    Create,
    Read,
    UpdateInfo,
    UpdateState
}