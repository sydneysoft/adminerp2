const { response } = require('express');

const path = require('path');

const Worker = require('../../models/modulo-recursos-humanos/worker');

const { getDataSistema } = require("../../helpers/db");
const { deleteFileIfExists } = require('../../helpers/deleteFileIfExists');



const showModule = async (req, res = response) => {
    const role = req.session.rol_id
    let token = req.session.token;
    let dataSession = req.session;
    let dataSistema = await getDataSistema(req.session.token);

    try {
        let bookStore

        const worker = new Worker();
        if (role == 1 || role == 2) {

            bookStore = await worker.getAllWorkers();
        } else if (role == 3) {
            bookStore = await worker.getWorkerByCompany(token);
        }
        if (role == 1 || role == 2 || role == 3) {
            res.render("modulo-recursos-humanos/workers/list-of-workers", {


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
        console.log(error);
        res.status(500).json({
            ok: false,
            error
        });
    }

}

const getWorkers = async (req, res = response) => {
    const role = req.session.rol_id
    let token = req.session.token;
    try {
        let workers

        const worker = new Worker();
        if (role == 1 || role == 2) {

            workers = await worker.getAllWorkers();
        } else if (role == 3) {
            workers = await worker.getWorkerByCompany(token);
        }
        return res.status(200).json({
            ok: true,
            workers
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error
        });
    }
}

const getWorkerById = async (req, res = response) => {
    try {

        const worker = new Worker();

        const [dbWorker] = await worker.getWorkerById(req.params.id);

        return res.status(200).json({
            ok: true,
            worker: dbWorker
        })
    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

const saveWorker = async (req, res = response) => {
    const role = req.session.rol_id
    let token = req.session.token;
    let worker;
    let result

    try {



        if (role == 1 || role == 2) {
            req.body = ({ ...req.body, empresa_id: 0 })

        }
        else if (role == 3) {
            req.body = ({ ...req.body, empresa_id: token })

        }
        worker = req.files ? new Worker({ ...req.body, ...req.files }) : new Worker(req.body)
        result = await worker.saveWorker();

        return res.status(200).json({
            ok: true,
            result
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

const updateWorker = async (req, res = response) => {
    try {

        const worker = new Worker();
        let result = null;
        const dbWorker = worker.getWorkerById(req.params.id);

        if (!dbWorker) {
            return res.status(400).json({
                ok: false,
                msg: 'El trabajador que intentas actualizar no existe'
            })
        }

        if (!req.files) {
            result = await worker.updateWorkerById({ ...req.body, id: req.params.id });

        } else {


            [dbWorker.CV, dbWorker.foto_de_documento_cara_frontal, dbWorker.foto_de_documento_cara_trasera, dbWorker.contrato]
                .filter(file => file !== undefined && file !== null && file)
                .forEach(file => {
                    deleteFileIfExists(path.join(__dirname, '../public/uploads/', file))
                })

            result = await worker.updateWorkerById({ ...req.body, id: req.params.id, ...req.files });
        }


        return res.status(200).json({
            ok: true,
            result
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

const deleteWorker = async (req, res = response) => {
    try {

        const worker = new Worker();

        const [dbWorker] = await worker.getWorkerById(req.params.id);

        if (!dbWorker) {
            return res.status(400).json({
                ok: false,
                msg: 'El trabajador que intentas eliminar no existe'
            })
        }

        [dbWorker.CV, dbWorker.foto_de_documento_cara_frontal, dbWorker.foto_de_documento_cara_trasera, dbWorker.contrato]
            .filter(file => file !== undefined && file !== null && file)
            .forEach(file => {
                deleteFileIfExists(path.join(__dirname, '../public/uploads/', file))
            })


        const result = await worker.deleteWorkerById(req.params.id);

        return res.status(200).json({
            ok: true,
            result
        })
    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

module.exports = {
    showModule,
    getWorkers,
    getWorkerById,
    saveWorker,
    updateWorker,
    deleteWorker
}