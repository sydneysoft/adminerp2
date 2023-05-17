const { Router } = require("express");
const router = Router();

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const {EVResult} = require('../../middlewares/EVResult.middleware');

const { ProductoController, StockController} = require('../../controllers/modulo-ecommerce/productos/index');
const {CategoriaController} = require('../../controllers/modulo-ecommerce/categorias.controller');
const {SubcategoriaController} = require('../../controllers/modulo-ecommerce/subcategorias.controller');
const {AlmacenController} = require('../../controllers/modulo-ecommerce/almacenes.controller');
const {EmpresaMarketplaceController} = require('../../controllers/modulo-marketplace/empresas-marketplace.controller');
const {MarketplaceController} = require('../../controllers/modulo-marketplace/marketplace.controller');

const {service: ProductoService} = ProductoController;
const {service: StockService} = StockController;
const {service: CategoriaService} = CategoriaController;
const {service: SubcategoriaService} = SubcategoriaController;
const {service: AlmacenService} = AlmacenController;
const {service: EmpresaMarketplaceService} = EmpresaMarketplaceController;
const {service: MarketplaceService} = MarketplaceController;


router.get("/datatable/:id?", ProductoController.datatable);

router.get("/", async (req, res) => {
    try {
        const { role, token, dataSistema, dataSession } = await getAllDataSession(req);
        if (role == 1 || role == 2) {
            return res.render("modulo-ecommerce/prendas/superadmin", {
                dataSession,
                dataSistema,
            });
        }

        return res.render("modulo-ecommerce/prendas", {
            dataSession,
            dataSistema,
        });

        let items
        if (role == 1 || role == 2) {
            let categorias = await CategoriaService.getCategoryPrendas()
            let idCategorias = categorias.map(i => i.id)
            let prendas = await ProductoService.getPrendas(idCategorias);
            let stock = await StockService.getAll();
            let almacenes = await AlmacenService.getAll();
            let subcategorias = await SubcategoriaService.getSubCategoriesPrenda();
            let empresas = await EmpresaMarketplaceService.getAll();
            let activo_marketplace = await MarketplaceService.getById(1)
            activo_marketplace = activo_marketplace[0].habilitado
            items = {
                prendas,
                stock,
                almacenes,
                subcategorias,
                empresas,
                categorias,
                marketplace: activo_marketplace
            };
            res.render("modulo-ecommerce/prendas/admin-prendas", {
                items,
                dataSession,
                dataSistema,
                token
            });
        } else if (role == 3) {
            let stock = await StockService.getAll();
            let almacenes = await AlmacenService.getbyCompany(token);
            let categorias = await CategoriaService.getNumberCategory(token)
            let prendas = await ProductoService.getPrendasByCompany(token, categorias[0].id);
            let subcategorias = await SubcategoriaService.getSubCategoriesByCompanyPrenda(token, categorias[0].id)
            let empresas = await EmpresaMarketplaceService.getById(token);
            items = {
                prendas: prendas,
                stock: stock,
                almacenes: almacenes,
                categorias: categorias,
                subcategorias: subcategorias,
                empresas: empresas,
                marketplace: false
            };
            res.render("modulo-ecommerce/prendas/admin-prendas", {
                items,
                dataSession,
                dataSistema,
                token
            });
        } else {
            res.status(403)
            res.render('403');
        }
    } catch (error) {
        return catchError(res, error);
    }
})

router.get("/empresa/:id", async (req, res) => {
    try {
        const { dataSession, dataSistema } = await getAllDataSession(req);

        return res.render("modulo-ecommerce/prendas", {
            dataSession,
            dataSistema,
            empresa_id: req.params.id
        });

    } catch (error) {
        return catchError(res, error);
    }
})


module.exports = router;
