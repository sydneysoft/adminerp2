const { dbConnection } = require('../database/config');

const { db, con } = dbConnection();

//Metadatos WEB 
const getDataSistema = async (token) => {
    let queryDataSistema
    try {
        if (token) {
              queryDataSistema = await db.query(con, `SELECT * FROM configuracion_sistema where empresa_id=${token} limit 1`)[0];

        } else {
            queryDataSistema=[{logo:"",favicon:""}]  
        }
        return queryDataSistema;
    } catch (e) {
        console.log(e);
        return [];
    }
}


const listarTableDinamic = async (tableName) => {
    try {
        let sql
        switch (tableName) {
            case "prendas":
                sql = "SELECT * FROM productos WHERE categoria = 9999"; //9999 is default category for prenda, never change
                break;
            case "productos":
                sql = "SELECT * FROM productos WHERE categoria != 9999"; //9999 is default category for prenda, never change
                break;
            case "subcategorias-prenda":
                sql = "SELECT * FROM subcategorias WHERE categoria = 9999"; //9999 is default category for prenda, never change
                break;

            default:
                sql = "SELECT * FROM " + tableName;
        }

        let dataQuery2 = await db.query(con, sql);
        return dataQuery2;
    } catch (e) {
        return { status: "error", msg: e };
    }
};


//Filtrar Data Dinámica
const filtrarData = async (nombretabla, id, nombreid, numerico) => {
    try {
        if (nombretabla != undefined & nombretabla != ""
            & id != undefined & id != ""
            & nombreid != undefined & nombreid != ""
            & numerico != undefined & numerico != "") {
            if (numerico == "1") {
                var queryFilter = "SELECT * from " + nombretabla + " where  " + nombreid + "=" + id;
            } else {
                var queryFilter = "SELECT * from " + nombretabla + " where  " + nombreid + "='" + id + "'";
            }

            let queryDataFilter = await db.query(con, queryFilter);
            return queryDataFilter;
        } else {
            return { status: "Error", msg: "Datos Indefinidos" }
        }
    } catch (e) {
        return { status: "Error", msg: e }
    }
};

module.exports = {
    getDataSistema,
    listarTableDinamic,
    filtrarData
}