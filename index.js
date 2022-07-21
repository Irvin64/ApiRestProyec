const express = require('express');
const cors = require("cors");
const mysql = require("mysql");

const PORT = process.env.PORT || 3050;

const app = express();
app.use(cors());
app.use(express.json());

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "login"
});

app.get("/", (req, res) => {
    res.send("Esto se supone que debe de funcionar");
});

// endpoint donde vamos a optener la informacion
app.get("/usuarios", (req,res) => {
    const sql = "SELECT * FROM usuarios";
    conexion.query(sql, (error,result)=>{
        if(error) {res.send(`Tenemos este ${error}`);}
        if(result.length >0){
            res.json(result);
        }else{
            res.send("No results in Table usuarios.");
        }
    });
});

//blogs
app.get("/blog",(req,res) => {
    const sql = "SELECT * FROM blog";
    conexion.query(sql,(error, result) => {
        if(error){
            res.send(`Tenemos este ${error}`);
        }
        if(result.length > 0){
            res.json(result);
        }else{
            res.send("No results in Table Blogs");
        }
    });
});

//endPoint para obtener un usuario en especifico
app.get("/usuarios/:id", (req,res)=>{
    const {id} = req.params;
    const sql = `SELECT * FROM usuarios WHERE uid=${id}`;
    conexion.query(sql, (error,result)=>{
        if(error) {res.send(`No encontramos al user`)}
        if(result.length > 0){
            res.json(result);
        }else{
            res.send(`No existe el usuario con el id = ${id}`);
        }
    });
});


//end point para insertar un usuario
app.post("/insert", (req, res) =>{
    const sql = `INSERT INTO usuarios SET ?`;
    const userObject = {
        uid: req.body.id,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        email: req.body.email,
        password: req.body.password,
        tipo: req.body.tipo,
        token: req.body.token,
    }
conexion.query(sql, userObject, error =>{
    if (error) res.send("No se pudo insertar");
    res.send("Usuario insertado");
});

});

//Endpoint para modificar un usuario
app.put("/update/:id", (req, res)=>{
const {id}  = req.params;
const {nombre, apellidos, email, password, tipo, token}  = req.body;
const sql = `UPDATE usuarios SET nombre ='${nombre}', apellidos='${apellidos}',
email='${email}', password='${password}', tipo='${tipo}', token='${token}' WHERE uid='${id}'`;
conexion.query(sql, error =>{
    if (error) res.send("No se puede modificar el usuario");
    res.send("Usuario Modificado");
});
});


app.delete("/delete/:id", (req, res)=>{
    const{id} = req.params;
    const sql = `DELETE FROM usuarios WHERE uid=${id}`;
    conexion.query(sql,error =>{
        if(error){ res.send("No pudimos eliminar ese usuario");
        res.send(`Usuario con id ${id} fue ELIMINADO`);
        }
    });
});

conexion.connect((error) =>{
    if(error){
        throw error;
        console.log("Error de conexión");
    }
});

app.listen(PORT, ()=> console.log(`Servidor funcionando en la puerto ${PORT}` ));