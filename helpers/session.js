const { dbConnection } = require("../database/config")
const moment = require("moment");
const { db, con } = dbConnection();
const updateSesionQuery = async ({ correo, id }, { ipData, dateConextion, browser, device, platform }) => {
    try {
        const operations = `UPDATE usuarios SET session_status = 'online', device = '${device}', platform = '${platform}', browser = '${browser}', ip = '${ipData}', ultima_conexion = '${moment(dateConextion).format("YYYY-MM-DD HH:mm:ss")}' WHERE correo = '${correo}' AND id = ${id} LIMIT 1`;
        const updated = await db.query(con, operations);
        return updated;
    } catch (error) {
        console.error({ error })
        return { status: "Error", msg: error }
    }
};

module.exports={updateSesionQuery}