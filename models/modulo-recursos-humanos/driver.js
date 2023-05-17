
const { dbConnection } = require("../../database/config");

const { db, con } = dbConnection()

class Driver {
    constructor({
        primer_nombre = '',
        segundo_nombre = '',
        apellido_paterno = '',
        apellido_materno = '',
        tipo_de_documento = '',
        numero_de_documento = '',
        foto_de_documento_cara_frontal = '',
        foto_de_documento_cara_trasera = '',
        tipo_de_licencia = '',
        numero_de_licencia = '',
        foto_de_licencia_cara_frontal = '',
        foto_de_licencia_cara_trasera = '',
        fecha_de_contratacion = '',
        estado = '',
        fecha_de_despido = '',
        observaciones = '',
        tipo_de_vehiculo = '',
        id = '',
        empresa_id=''
    } = {}) {
        this.primer_nombre = primer_nombre; 
        this.segundo_nombre = segundo_nombre; 
        this.apellido_paterno = apellido_paterno; 
        this.apellido_materno = apellido_materno; 
        this.tipo_de_documento = tipo_de_documento; 
        this.numero_de_documento = numero_de_documento; 
        this.foto_de_documento_cara_frontal = foto_de_documento_cara_frontal; 
        this.foto_de_documento_cara_trasera = foto_de_documento_cara_trasera; 
        this.tipo_de_licencia = tipo_de_licencia; 
        this.numero_de_licencia = numero_de_licencia; 
        this.foto_de_licencia_cara_frontal = foto_de_licencia_cara_frontal; 
        this.foto_de_licencia_cara_trasera = foto_de_licencia_cara_trasera; 
        this.fecha_de_contratacion = fecha_de_contratacion; 
        this.estado = estado; 
        this.fecha_de_despido = fecha_de_despido; 
        this.observaciones = observaciones; 
        this.tipo_de_vehiculo = tipo_de_vehiculo; 
        this.id = id || null;
        this.empresa_id = empresa_id  ; 

        this.TABLE = 'choferes';
    }

    getAllDrivers = async () => await db.query(con, `SELECT * FROM ${this.TABLE}`);


    getDriverById = async (id = '') => await db.query(con, `SELECT * FROM ${this.TABLE} WHERE id = "${id}"`);

    getDriverByCompany = async (id = '') => await db.query(con, `SELECT * FROM ${this.TABLE} WHERE empresa_id = "${id}"`);

    deleteDriverById = async (id = '') => await db.query(con, `DELETE FROM ${this.TABLE} WHERE id = "${id}";`);

    updateDriverById = async (data = {}) => {

        let query = `UPDATE ${this.TABLE} SET`;

        const fields = Object.keys(data)
            .filter(key => key !== 'id' && this.hasOwnProperty(key))
            .filter(key => data[key] !== '')

        fields.forEach((key, index, array) => {
            const value = data[key].name
                ? data[key].name
                : data[key];

            query += ` ${key} = '${value}' `;
            query += index !== array.length - 1 ? ', ' : ' '
        });

        query += ` WHERE id = '${data.id}';`

        return await db.query(con, query);
    }

    saveDriver = async () => {
        const fields = Object.keys(this).filter(key => typeof this[key] !== 'function' && this[key] && key !== 'TABLE');

        let query = `INSERT INTO ${this.TABLE} (`;

        fields.forEach((key, index) => index !== 0 ? query += `, ${key} ` : query += ` ${key} `);

        query += ') VALUES (';

        fields.forEach((key, index, array) => {
            const value = this[key].name
                ? this[key].name
                : this[key];

            query += "'" + value + "'";

            query += index !== array.length - 1 ? ', ' : ' '

        });

        query += ');'

        // return query;
        return await db.query(con, query);
    }
}

module.exports = Driver; 