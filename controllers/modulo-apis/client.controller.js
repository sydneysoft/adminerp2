const ServiceSQL = require("../../services/services");
const logger = require("../../helpers/logger");

class ClientController {
    constructor() {
        this.productos = new ServiceSQL("productos");
        this.marcas = new ServiceSQL("marcas");

    }

    getHome = async (req, res) => {
        const id = req.params.id;
        try {
            const productosrec = await this.productos.getbyCompanyHome(id);
            const marcas = await this.marcas.getbyCompanyHome(id);


            return res.status(200).json({ marcas: marcas, productosrec: productosrec })

        } catch (error) {
            logger.error("Error al mostrar home", error)
        }

    };

    getProduct = async (req, res) => {
        const id = req.params.id;
        try {
            const producto = await this.productos.getById(id);
            return res.status(200).json({ producto: producto })

        } catch (error) {
            logger.error("Error al mostrar home", error)
        }

    };

    getProductRelationated = async (req, res) => {
        const id = req.params.id;
        try {
            const producto = await this.productos.getByCategorie(id);
            return res.status(200).json({ producto: producto })

        } catch (error) {
            logger.error("Error al mostrar home", error)
        }

    };
    getProductOferta = async (req, res) => {
        const id = req.params.id;
        try {
            const producto = await this.productos.getByOferta(id);
            return res.status(200).json({ producto: producto })

        } catch (error) {
            logger.error("Error al mostrar home", error)
        }

    };
}

module.exports = ClientController;
