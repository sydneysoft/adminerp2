const { makeDb } = require("mysql-async-simple");
const mysql = require("mysql");

const connectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max_connections: 5000
};
const dbConnection = () => {
  
  try {
    //Conexión a la Base de Datos Interna
    const con = mysql.createPool(connectionOptions);

    const db = makeDb();
  
    return {
      db,
      con,
    };

  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  dbConnection,
  connectionOptions
};
