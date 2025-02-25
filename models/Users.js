import bcrypt from "bcrypt";
import pool from "../config/db.js";

//añadir un usuario
async function Create(data) {
    const {password, ...rest} = data; // '...' en este caso, esto operador de tres puntos está formando parte de la desestructuración del array enviado por el controlador
                                     // obtenemoso password del array data y todo lo demás de guarda en rest
    //encriptar la contraseña del usuario 

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password,salt);
    let user = {...rest,hashed_password:hashed_password};//de esta manera está listo el objeto para ser insertad en la bd
    user = Object.values(user); //devueve un array con los valores que hay en el objeto user
    await pool.query('INSERT INTO Users (role_id,username,hashed_password) VALUES(?,?,?)',user); //no especificamos el último campo 'active' porque la bd tiene DEFAULT TRUE
    console.log(`se ha insertado ${user} en la bd`);
}

async function Read() {
    const query = "SELECT u.id, r.role_name, u.username, u.active_user "+
                    "FROM Users u JOIN Roles r on u.role_id = r.id";
    const [users] = await pool.query(query);//devuelve todos lo usuario y su respectivo rol
    return users;
}

async function UpdateProfile(data,id) {
    //hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    let password = data.password;
    password = await bcrypt.hash(password,salt);
    //actualizar
    let user = {username: data.username,hashed_password:password, id:id};//creo un nuevo objeto que contenga el id del usuario a actualizar
    user = Object.values(user); //array con los datos a actualizar
    const [updatedUser] = await pool.query('UPDATE Users SET username = ?, hashed_password = ? WHERE id = ?', user);
    return updatedUser;
}

async function UpdateRole(data,id) {
    let user = Object.values(data);
    user.push(id);//agregamos el id del usuario al array con los datos para actualizar

    const [updatedUser] = await pool.query('UPDATE Users SET role_id = ? WHERE id = ?',user);
    return updatedUser;
}

async function Delete(id) {
    const [user] = await pool.query("DELETE FROM Users WHERE id = ?",id);
    return user;
}

async function Login(data) {
    const {username,password} = data;
    const [user] = await pool.query('SELECT * FROM Users WHERE BINARY username = ?',[username]);
    //verificar si el usuario existe, sino retornamos el array vacío y ya no ejecutamos el resto del código
    if(user.length === 0){
        return user;
    }
    //verificamos si ha ingresado una contraseña correcta
    const auth = bcrypt.compareSync(password, user[0].hashed_password);
    user[0].auth = auth;
    if(!auth){
        return user;
    }
        
    return user;
}
export{
    Create,
    Read,
    UpdateProfile,
    UpdateRole,
    Delete,
    Login
}