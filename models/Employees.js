import pool from "../config/db.js";
//create employees

async function Create(data) {
    //el user_id será null porque en la vista, a la hora de crear un usuario, mostraremos los empleados sin usuario,
    //de esa manera se crea el usuario y al mismo tiempo se actualiza el user_id del empleado para que tenga un usuario asignado

    //agregar NULL al inicio de array para mantener las consultas parametrizadas
    data.unshift(null);
    let query ="INSERT INTO Employees(user_id, employee_name, employee_lastname, phone_number, email, address) VALUES (?, ?, ?, ?, ?, ?)";
    const [employee]= await pool.query(query,data);
    console.log(`Se ha insertado ${employee}`);
}

//asinar un usuario al empleado
async function AssignUser(userId,id) {
    let employee = Object.values(userId);
    employee.push(id);
    const [updatedEmployee] = await pool.query("UPDATE Employees SET user_id = ? WHERE id = ?",employee);
    return updatedEmployee;
}

//mostrar empleados
async function Read() {
    const [employees] = await pool.query("SELECT id, employee_name, employee_lastname, phone_number, email, address FROM Employees WHERE active_employee = 1");
    return employees;
}

//actualizar el contacto del empleado
async function UpdateEmployeeContact(data,id) {
    let employee = Object.values(data);
    employee.push(id);
    const [updatedEmployee] = await pool.query("UPDATE Employees SET phone_number = ?, email = ?, address = ? WHERE id = ?",employee);
    return updatedEmployee;
}

async function Desactive(id) {
    const data = [false,id];
    const [employee] = await pool.query("UPDATE Employees SET active_employee = ? WHERE id = ?",data)
    return employee;
}

export{
    Create,
    AssignUser,
    Read,
    UpdateEmployeeContact,
    Desactive
}