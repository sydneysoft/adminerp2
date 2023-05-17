const { Router } = require("express");
const router = Router()

const { PedidoController } = require("../../controllers/modulo-ecommerce/pedidos.controller");
const { PedidoProductoController } = require("../../controllers/modulo-ecommerce/pedido-productos.controller");


const { service: PedidoService } = PedidoController;
const { service: PedidoProductoService } = PedidoProductoController;



const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

router.get("/datatable/:id?",
check('draw').optional().isInt({min: 1}),
check('start').optional().isInt({min: 0}),
check('length').optional().isInt({min: 1}),
check('order').optional().isArray({min: 1}),
EVResult, PedidoController.datatable);
router.get("/select2/:id?", PedidoController.select2);

router.get("/", async (req, res) => {
    try {
        let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
        if (role == 1 || role == 2) {
            token = 0;
            return res.render("modulo-ecommerce/pedidos/superadmin", {
                dataSession,
                dataSistema
            });
        }
        return res.render("modulo-ecommerce/pedidos/index", {
            dataSession,
            dataSistema
        });
    } catch (error) {
        return catchError(res, error);
    }
});

router.get("/empresa/:id", async (req, res) => {
    try {
        const { dataSession, dataSistema } = await getAllDataSession(req);

        return res.render("modulo-ecommerce/pedidos/index", {
            dataSession,
            dataSistema,
            empresa_id: req.params.id
        });
    } catch (error) {
        return catchError(res, error);
    }
});

router.get("/:id",
    check('id').optional(),
    EVResult, async (req, res) => {
        // let ciudad
        let productos
        const id = parseInt(req.params.id);
        try {
            const data = await PedidoService.getbyCondition(id)
            if (data[0]) {
                if (data[0].ciudad == undefined) {
                    data[0].ciudad = 1;
                }
                // ciudad = await this.ciudades.getByCityID(data[0].ciudad)
                productos = await PedidoProductoService.getByPedido(data[0].id)
            }
            return res.json({
                status: "success",
                data: data,
                // ciudad: ciudad, 
                productos: productos
            });
        } catch (error) {
            return catchError(res, error);
        }
    })


router.put("/:id",
    check('id').optional(),
    check('usuario').optional(),
    check('fecha_registro').optional(),
    check('estado').optional(),
    check('tipo_pago').optional(),
    check('valor_servicio').optional(),
    check('valor_env').optional(),
    check('direccion_entrega').optional(),
    check('suma_subtotal').optional(),
    check('cip').optional(),
    check('link_factura').optional(),
    check('nombre_empresa').optional(),
    check('codigo_factura').optional(),
    check('empresa_id').optional(),
    check('nombre').optional(),
    check('apellido').optional(),
    check('direccion_opcional').optional(),
    check('ciudad').optional(),
    check('provincia').optional(),
    check('cod_postal').optional(),
    check('celular').optional(),
    check('pais').optional(),
    check('payment_id').optional(),
    check('moneda').optional(),
    check('metodo_envio').optional(),
    EVResult, PedidoController.update);
router.delete("/:id",
    check('id').optional(),
    EVResult, PedidoController.delete);

module.exports = router;

