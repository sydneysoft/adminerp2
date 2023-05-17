class Landing {
    constructor() { }
    getHistoriaEmpresa = async () => {
            try {
                    let queryData = "SELECT historia, historiaImg FROM `configuracion_sistema` ";
                    let result = await db.query(con, queryData);
                    return result;
            } catch (e) {
                    return "";
            }
    }


    getVision = async () => {
            try {
                    let queryData = "SELECT vision, visionImg FROM `configuracion_sistema` ";
                    let result = await db.query(con, queryData);
                    return result;
            } catch (e) {
                    return "";
            }
    }


    getMision = async () => {
            try {
                    let queryData = "SELECT mision, misionImg FROM `configuracion_sistema` ";
                    let result = await db.query(con, queryData);
                    return result;
            } catch (e) {
                    return "";
            }
    }


    getGaleria = async () => {
            try {
                    let queryData = "SELECT name, descripcion, descripcion_corta, imagen FROM `platos` ";
                    let result = await db.query(con, queryData);
                    return result;
            } catch (e) {
                    return "";
            }
    }


    getClientesDestacados = async () => {
            try {
                    let queryData = "SELECT nombre as name, url, imagen as image FROM `clientes_landing` ";
                    let result = await db.query(con, queryData);
                    return result;
            } catch (e) {
                    return "";
            }
    }

    getTestimoniosDestacados = async () => {
            try {
                    let queryData = "SELECT nombre as name, apellido as lastname, imagen as image, texto as text FROM `testimonios` ";
                    let result = await db.query(con, queryData);
                    return result;
            } catch (e) {
                    return "";
            }
    }

    getServiciosInformacion = async () => {
            try {
                    let queryData = "SELECT nombre as name, descripcion as description, descripcion_corta as short_description, imagen as image FROM `servicios_landing` " ;
                    let result = await db.query(con, queryData);
                    return result;
            } catch (e) {
                    return "";
            }
    }

    getPlanes = async () => {
            try {
                    let queryData = "SELECT lista_caracteristicas_planes.nombre as characteristic, planes.nombre as plan_name,"+
                    " planes.icono as plan_icon, planes.precio_mensual as monthly_price, planes.precio_anual as yearly_price "+
                    "from planes INNER JOIN lista_caracteristicas_planes ON planes.id=lista_caracteristicas_planes.id_plan ";
                    let result = await db.query(con, queryData);
                    return result;
            } catch (e) {
                    return "";
            }
    }
}
module.exports = Landing;