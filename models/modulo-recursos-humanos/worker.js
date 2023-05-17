
const { dbConnection } = require("../../database/config");

const { db, con } = dbConnection()

class Worker {
    constructor({
        id = '',
        primer_nombre = '',
        segundo_nombre = '',
        apellido_paterno = '',
        apellido_materno = '',
        celular = '',
        telefono = '',
        correo = '',
        direccion = '',
        tipo_de_documento = '',
        numero_de_documento = '',
        foto_de_documento_cara_frontal = '',
        foto_de_documento_cara_trasera = '',
        entidad_bancaria = '',
        numero_de_cuenta = '',
        AFP = '',
        CTS = '',
        observaciones = '',
        fecha_de_contratacion = '',
        estado = '',
        fecha_de_despido = '',
        CV = '',
        contrato = '',
        nombres_de_persona_de_contacto = '',
        celular_de_persona_de_contacto = '',
        tipo_de_documento_de_persona_de_contacto = '',
        numero_de_documento_de_persona_de_contacto = '',
        empresa_id = '',
    } = {}) {
        this.id = id || null;
        this.primer_nombre = primer_nombre;
        this.segundo_nombre = segundo_nombre;
        this.apellido_paterno = apellido_paterno;
        this.apellido_materno = apellido_materno;
        this.celular = celular;
        this.telefono = telefono;
        this.correo = correo;
        this.direccion = direccion;
        this.tipo_de_documento = tipo_de_documento;
        this.numero_de_documento = numero_de_documento;
        this.foto_de_documento_cara_frontal = foto_de_documento_cara_frontal;
        this.foto_de_documento_cara_trasera = foto_de_documento_cara_trasera;
        this.entidad_bancaria = entidad_bancaria;
        this.numero_de_cuenta = numero_de_cuenta;
        this.AFP = AFP;
        this.CTS = CTS;
        this.observaciones = observaciones;
        this.fecha_de_contratacion = fecha_de_contratacion;
        this.estado = estado;
        this.fecha_de_despido = fecha_de_despido;
        this.CV = CV;
        this.contrato = contrato;
        this.nombres_de_persona_de_contacto = nombres_de_persona_de_contacto;
        this.celular_de_persona_de_contacto = celular_de_persona_de_contacto;
        this.tipo_de_documento_de_persona_de_contacto = tipo_de_documento_de_persona_de_contacto;
        this.numero_de_documento_de_persona_de_contacto = numero_de_documento_de_persona_de_contacto;
        this.empresa_id = empresa_id;
        this.TABLE = 'empleados';
    }
    getAllWorkers = async () => await db.query(con, `SELECT * FROM ${this.TABLE}`);

    getWorkerById = async (id = '') => await db.query(con, `SELECT * FROM ${this.TABLE} WHERE id = "${id}"`);

    getWorkerByCompany= async (id = '') => await db.query(con, `SELECT * FROM ${this.TABLE} WHERE empresa_id = "${id}"`);
    deleteWorkerById = async (id = '') => await db.query(con, `DELETE FROM ${this.TABLE} WHERE id = "${id}";`);

    updateWorkerById = async (data = {}) => {

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

    saveWorker = async () => {
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

module.exports = Worker;