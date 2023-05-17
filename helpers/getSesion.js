const { dbConnection } = require('../database/config');
const moment = require("moment");
 
//Conexión a la Base de Datos Interna
const { db, con } = dbConnection();
// Función para traer datos de sesión en usuario.
const getDataUsersSessions = async ({ page, items, search, date }) => {
    try {
        let operations = "SELECT  correo, nombre, apellido, ip, ultima_conexion, device, platform, session_status, browser FROM usuarios"
        // Query si viene con busqueda
        if (date) {
            const gt = !date[0] ? null : moment(date[0]).startOf("day").format("YYYY-MM-DD HH:mm:ss");
            const lt = !date[1] ? null : moment(date[1]).endOf("day").format("YYYY-MM-DD HH:mm:ss");
            if (gt && lt) {
                operations = `${operations} WHERE ultima_conexion BETWEEN '${gt}' AND '${lt}'`
            } else if (!gt && lt) {
                operations = `${operations} WHERE ultima_conexion <='${lt}'`
            } else if (gt && !lt) {
                operations = `${operations} WHERE ultima_conexion >='${gt}'`
            }
        }
        if (search) {
            const fields = ["id", "correo", "nombre", "apellido", "ip"];
            const tags = search.split(",");
            const fieldsToSearch = fields.map(f => {
                return `${tags.map(t => `lower(${f}) LIKE '%${t}%'`).join(" OR ")}`
            }).join(" OR ");
            operations = !date ? `${operations} WHERE (${fieldsToSearch})` : `${operations} AND (${fieldsToSearch})`;
        }

        // query si cambia pagina y o cantidad de items por pagina
        if (page && items && items > 0) {
            operations = page > 1 ?
                `${operations} LIMIT ${items} OFFSET ${items * page}` :
                `${operations} LIMIT ${items}`;
        }
        const [data, total] = await Promise.all([await db.query(con, operations), await db.query(con, "SELECT COUNT(*) FROM usuarios")]);

        const raw = data.map(d => JSON.parse(JSON.stringify(d)));
        const pages = search ? Math.ceil(raw.length / items) : Math.ceil(total[0]["COUNT(*)"] / items);

        return { data: [...raw], total: total[0]["COUNT(*)"], pages };
    } catch (error) {

        return { status: "Error", msg: error }
    }
}

module.exports = {getDataUsersSessions}