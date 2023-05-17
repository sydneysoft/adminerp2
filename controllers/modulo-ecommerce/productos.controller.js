const ServiceSQL = require("../../services/services");
const { getDataSistema } = require('../../helpers/db');
const logger = require("../../helpers/logger");

class ProductosController {
    constructor() {
        this.productos = new ServiceSQL("productos");
        this.stock = new ServiceSQL("stock");
        this.subcategorias = new ServiceSQL("subcategorias");
        this.categorias = new ServiceSQL("categorias");
        this.almacenes = new ServiceSQL("almacenes");
        this.empresas_marketplace = new ServiceSQL("empresas_marketplace");
        this.marketplace = new ServiceSQL("marketplace");
        this.configuracion = new ServiceSQL("configuracion_sistema");
        this.banner = new ServiceSQL("banners");
        this.portadas = new ServiceSQL("portada_pages");
     
        this.marcas = new ServiceSQL("marcas");
        this.filtros = new ServiceSQL("grupo_filtro")

        this.sedes = new ServiceSQL("empresas_sedes")
        this.configuracion_correos = new ServiceSQL("configuracion_correos")
        this.metodos_envio = new ServiceSQL("metodos_envio")
        this.regiones = new ServiceSQL("regiones_entrega")



        //guardo fotoos de galeria por id_grupo
        this.productos_galeria_media = new ServiceSQL("productos_grupo_media")
        this.galeria_fotos = new ServiceSQL("galeria_fotos")



    }

    adminPrendas = async (req, res) => {
        try {

            const role = req.session.rol_id
            const token = req.session.token;
            const dataSession = req.session;
            const dataSistema = await getDataSistema(req.session.token)
            let items



            if (role == 1 || role == 2) {
                
                let categorias = await this.categorias.getCategoryPrendas()
                let idCategorias = categorias.map(i => i.id)

                let prendas = await this.productos.getPrendas(idCategorias);
                let stock = await this.stock.getAll();
                let almacenes = await this.almacenes.getAll();
                let subcategorias = await this.subcategorias.getSubCategoriesPrenda();

                let empresas = await this.empresas_marketplace.getAll();

                let activo_marketplace = await this.marketplace.getById(1)

                activo_marketplace = activo_marketplace[0].habilitado
                console.log(categorias, subcategorias);
                items = {
                    prendas,
                    stock,
                    almacenes,
                    subcategorias,
                    empresas,
                    categorias,
                    marketplace: activo_marketplace
                };
                res.render("modulo-ecommerce/productos-prendas/admin-prendas", {
                    items,
                    dataSession,
                    dataSistema,
                    token
                });
            } else if (role == 3) {


                let stock = await this.stock.getAll();
                let almacenes = await this.almacenes.getbyCompany(token);
                let categorias = await this.categorias.getNumberCategory(token)
                let prendas = await this.productos.getPrendasByCompany(token, categorias[0].id);
                let subcategorias = await this.subcategorias.getSubCategoriesByCompanyPrenda(token, categorias[0].id)
                let empresas = await this.empresas_marketplace.getById(token);

                console.log(categorias, subcategorias)
                items = {
                    prendas: prendas,
                    stock: stock,
                    almacenes: almacenes,
                    categorias: categorias,
                    subcategorias: subcategorias,
                    empresas: empresas,
                    marketplace: false
                };
                res.render("modulo-ecommerce/productos-prendas/admin-prendas", {
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
            res.status(400).json({
                msg: error,
            });
        }
    };

    adminProductos = async (req, res) => {

        try {
            let dataSistema
            let items
            let role = req.session.rol_id
            let dataSession = req.session;
            let token

            if (role == 1 || role == 2) {

                token = 0
                dataSistema = await getDataSistema(0)

                let productos = await this.productos.getProductos();
                let stock = await this.stock.getAll();
                let almacenes = await this.almacenes.getAll();
                let categorias = await this.categorias.getCategories()
                let empresas = await this.empresas_marketplace.getAll();

                let activo_marketplace = await this.marketplace.getById(1)

                activo_marketplace = activo_marketplace[0].habilitado
                items = {
                    productos: productos,
                    stock: stock,
                    almacenes: almacenes,
                    categorias: categorias,
                    empresas: empresas,
                    marketplace: activo_marketplace
                };
                res.render("modulo-ecommerce/productos-prendas/admin-productos", {
                    items,
                    dataSession,
                    dataSistema,
                    token
                });
            } else if (role == 3) {
                token = req.session.token;
                dataSistema = await getDataSistema(req.session.token)
                let productos
                let categoriasPrendas = await this.categorias.getNumberCategory(token)
                if (categoriasPrendas[0]) {
                    productos = await this.productos.getProductosByCompany(token, categoriasPrendas[0].id);
                } else {
                    productos = await this.productos.getbyCompany(token);
                }
                let stock = await this.stock.getAll();
                let almacenes = await this.almacenes.getbyCompany(token);
                let categorias = await this.categorias.getCategoriesByCompany(token)
                let empresas = await this.empresas_marketplace.getById(token);

                items = {
                    productos: productos,
                    stock: stock,
                    almacenes: almacenes,
                    categorias: categorias,
                    empresas: empresas,
                    marketplace: false
                };
                res.render("modulo-ecommerce/productos-prendas/admin-productos", {
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
            logger.error("Fallo al mostrar productos", error)
            res.status(400).json({
                msg: error,
            });
        }
    }

    postGaleria = async (req, res) => {
        try {
            let last
            let checkLastGroup = await this.productos_galeria_media.checkLastNumber()
            if (checkLastGroup[0]) {
                last = checkLastGroup[0].id_grupo
            } else {
                last = 0
            }
            console.log("last", last)
            console.log("nuevoNumero", last)
            const nuevoNumero = last + 1
            nuevoNumero
            await this.productos.updateById(req.body.producto_id, { galeriaFotos: nuevoNumero })

            const fotos = req.body.fotos.map(picture =>
                ({ id_grupo: nuevoNumero, media_id: picture }));

            await this.productos_galeria_media.saveAll(fotos);
            res.status(200).json({
                status: "success",
                msg: "El producto se registro exitósamente",
            });

        } catch (error) {
            logger.error("Fallo al guardar galeria de  productos", error)
            res.status(400).json({
                msg: error,
            });
        }
    }



    getGaleria = async (req, res) => {
        try {
            let result = await this.productos_galeria_media.getGaleria(req.params.id)


            res.json(result);
        } catch (e) {
            res.json("");
        }
    }
    deletePicture = async (req, res) => {
        try {
            let checkGrupo = await this.productos.getImagenByGroup(req.body.id_producto)
            console.log(checkGrupo)
            console.log(checkGrupo[0].galeriaFotos)

            await this.productos_galeria_media.deleteByGroupImagen(req.params.id, checkGrupo[0].galeriaFotos)
            await this.galeria_fotos.deleteById(req.params.id)


            res.json({
                status: "success",
                msg: "Se actualizó la galería de fotos exitósamente",
            });
        } catch (e) {
            logger.error("Error al borra imagen,", e)
            res.json({
                status: "error",
                msg: "Ocurrió un errror interno intentalo nuevamente",
            });
        }
    }
    updateGaleria = async (req, res) => {


        let arrayUpdateImagenes = req.body.arrayUpdate;
        let grupo = req.body.id_grupo

        try {

            const guardoNuevasImagenesenGrupo = arrayUpdateImagenes.map(i => ({ id_grupo: grupo, media_id: i }))

            await this.productos_galeria_media.save(guardoNuevasImagenesenGrupo)

            res.json({
                status: "success",
                msg: "Se actualizó la galería de fotos exitósamente",
            });
        } catch (e) {
            logger.error("Error al guardar", e)
            res.json({
                status: "error",
                msg: "Ocurrió un errror interno intentalo nuevamente",
            });
        }
    }


}
module.exports = ProductosController;

