const { response } = require('express');

const path = require('path');
const Driver = require('../../models/modulo-recursos-humanos/driver');
const { getDataSistema } = require("../../helpers/db");
const logger = require("../../helpers/logger");

const { deleteFileIfExists } = require('../../helpers/deleteFileIfExists');



const showModule = async (req, res = response) => {
    const role = req.session.rol_id
    let token = req.session.token;
    let dataSession = req.session;
    let dataSistema = await getDataSistema(req.session.token);

    try {
        let bookStore

        const driver = new Driver();
        if (role == 1 || role == 2) {

            bookStore = await driver.getAllDrivers();
        } else if (role == 3) {
            bookStore = await driver.getDriverByCompany(token);
        }

        if (role == 1 || role == 2 || role == 3) {
            res.render("modulo-recursos-humanos/drivers/list-of-drivers", {


                dataSession,
                dataSistema,
                bookStore,
                token
            })
        } else {

            res.status(403);
            res.render('403');
        }




    } catch (error) {
        logger.error("error en modulo driver", error)
        res.status(500).json({
            ok: false,
            error
        });
    }

}

const getDrivers = async (req, res = response) => {

    const role = req.session.rol_id
    let token = req.session.token;

    let drivers
    try {


        const driver = new Driver();
        if (role == 1 || role == 2) {


            drivers = await driver.getAllDrivers();
        } else if (role == 3) {
            drivers = await driver.getDriverByCompany(token);
        }
        return res.status(200).json({
            ok: true,
            drivers
        });

    } catch (error) {
        logger.error("error en modulo driver", error)
        res.status(500).json({
            ok: false,
            error
        });
    }
}

const getDriverById = async (req, res = response) => {
    try {

        const driver = new Driver();

        const [dbDriver] = await driver.getDriverById(req.params.id);

        return res.status(200).json({
            ok: true,
            driver: dbDriver
        })
    } catch (error) {

        logger.error("error en modulo driver", error)

        res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

const saveDriver = async (req, res = response) => {
    const role = req.session.rol_id
    let token = req.session.token;
    let driver;
    let result
    try {


        if (role == 1 || role == 2) {
            req.body = ({ ...req.body, empresa_id: 0 })

        }
        else if (role == 3) {
            req.body = ({ ...req.body, empresa_id: token })

        }
        driver = req.files ? new Driver({ ...req.body, ...req.files }) : new Driver(req.body)
        result = await driver.saveDriver();
        return res.status(200).json({
            ok: true,
            result
        });

    } catch (error) {

        logger.error("error en modulo driver", error)

        res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

const updateDriver = async (req, res = response) => {
    try {

        const driver = new Driver();
        let result = null;
        const dbDriver = driver.getDriverById(req.params.id);

        if (!dbDriver) {
            return res.status(400).json({
                ok: false,
                msg: 'El trabajador que intentas actualizar no existe'
            })
        }

        if (!req.files) {
            result = await driver.updateDriverById({ ...req.body, id: req.params.id });

        } else {


            [dbDriver.foto_de_licencia_cara_trasera, dbDriver.foto_de_licencia_cara_frontal, dbDriver.foto_de_documento_cara_trasera, dbDriver.foto_de_documento_cara_frontal]
                .filter(file => file !== undefined && file !== null && file)
                .forEach(file => {
                    deleteFileIfExists(path.join(__dirname, '../public/uploads/', file))
                })

            result = await driver.updateDriverById({ ...req.body, id: req.params.id, ...req.files });
        }


        return res.status(200).json({
            ok: true,
            result
        });

    } catch (error) {

        logger.error("error en modulo driver", error)

        res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

const deleteDriver = async (req, res = response) => {
    try {

        const driver = new Driver();

        const [dbDriver] = await driver.getDriverById(req.params.id);

        if (!dbDriver) {
            return res.status(400).json({
                ok: false,
                msg: 'El trabajador que intentas eliminar no existe'
            })
        }

        [dbDriver.foto_de_licencia_cara_trasera, dbDriver.foto_de_licencia_cara_frontal, dbDriver.foto_de_documento_cara_trasera, dbDriver.foto_de_documento_cara_frontal]
            .filter(file => file !== undefined && file !== null && file)
            .forEach(file => {
                deleteFileIfExists(path.join(__dirname, '../public/uploads/', file))
            })


        const result = await driver.deleteDriverById(req.params.id);

        return res.status(200).json({
            ok: true,
            result
        })
    } catch (error) {

        logger.error("error en modulo driver", error)

        res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

module.exports = {
    showModule,
    getDrivers,
    getDriverById,
    saveDriver,
    updateDriver,
    deleteDriver
}