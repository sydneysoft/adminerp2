const { response } = require('express');

const path = require('path');

const Worker = require('../models/worker');


const { sendDataViewNew } = require('../helpers/handle-views');
const { deleteFileIfExists } = require('../helpers/deleteFileIfExists');



const showModule = (req, res = response) => {
    let dataView = 'workers/list-of-workers';
    sendDataViewNew("empleados", res, dataView, req);
}

const getWorkers = async (req, res = response) => {
    try {

        const worker = new Worker();
        const workers = await worker.getAllWorkers();

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
    try {

        const worker = req.files ? new Worker({ ...req.body, ...req.files }) : new Worker(req.body)
        const result = await worker.saveWorker();

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