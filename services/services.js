const { connectionOptions } = require("../database/config");
const logger = require("../helpers/logger.js");

const knex = require("knex")({
  client: "mysql",
  connection: connectionOptions,
});

class ServiceSQL {
  constructor(nombreColeccion) {
    this.nombreColeccion = nombreColeccion;
  }

  checkExist = async () => {
    const exists = await knex.schema.hasTable(this.nombreColeccion);

    if (exists === false) {
      switch (this.nombreColeccion) {
        case "almacenes":
          return this.crearTablaAlmacen(this.nombreColeccion);
          break;

        case "pago_personal":
          return this.crearTablaPersonal(this.nombreColeccion);
          break;
        case "pago_proveedores":
          return this.crearTablaPagoProveedores(this.nombreColeccion);
          break;

        case "proveedores":
          return this.crearTablaProveedores(this.nombreColeccion);
          break;

        case "insumos":
          return this.crearTablaInsumos(this.nombreColeccion);
          break;

        case "stock":
          return this.crearTablaStock(this.nombreColeccion);
          break;
        case "personal":
          return this.crearTablaNuevoPersonal(this.nombreColeccion);
          break;
        case "cotizaciones":
          return this.crearTablaNuevaCotizacion(this.nombreColeccion);
          break;
        case "cotizaciones_detalle":
          return this.crearTablaCotizacionDetalle(this.nombreColeccion);
          break;
        case "cotizaciones_clientes":
          return this.crearTablaCotizacionCliente(this.nombreColeccion);
          break;
        case "cotizaciones_servicios":
          return this.crearTablaCotizacionServicios(this.nombreColeccion);
          break;
        case "cotizaciones_impuestos":
          return this.crearTablaCotizacionImpuestos(this.nombreColeccion);
          break;
        case "empresas_marketplace":
          return this.crearTablaEmpresas(this.nombreColeccion);
          break;
        case "marketplace":
          return this.crearTablaMarket(this.nombreColeccion);
          break;
        case "empresas_registrados":
          return this.crearTablaRegistrados(this.nombreColeccion);
          break;
        case "empresas_registradas_categorias":
          return this.crearTablaEmpresaCategorias(this.nombreColeccion);
          break;
        case "empresas_categorias":
          return this.crearTablaCategoriasModulos(this.nombreColeccion);
          break;
        case "stream_programas":
          return this.crearTablaProgramas(this.nombreColeccion);
          break;
        case "stream_directores":
          return this.crearTablePeople(this.nombreColeccion);
          break;
        case "stream_productores":
          return this.crearTablePeople(this.nombreColeccion);
          break;
        case "stream_actores":
          return this.crearTablaPersonal(this.nombreColeccion)
      }
    }
  };
  getModulesAll = async () => {
    try {
      const items = await knex.select().from(this.nombreColeccion)

      return items;
    } catch (error) {
      logger.error("Error al obtener modulos", error)
    }

  };
  getAll = async () => {
    await this.checkExist();
    const items = await knex.select().from(this.nombreColeccion);
    return items;
  };
  getModules = async () => {
    await this.checkExist();
    const items = await knex.select("nombre").from(this.nombreColeccion).where({ "activo": 1 }).timeout(1000);
    return items;
  };
  getDataUsersSessionsByCompany = async (id) => {

    return await knex.select("correo, nombre, apellido, ip, ultima_conexion, device, platform, session_status, browser").from(this.nombreColeccion).where({ "empresa_id": id })

  };
  getDataUsersSessions = async (id) => {

    return await knex.select("correo, nombre, apellido, ip, ultima_conexion, device, platform, session_status, browser").from(this.nombreColeccion)

  };
  getPrendas = async () => {

    const items = await knex.select().from(this.nombreColeccion).where({ "categoria": 9999 })
    return items;
  };
  getPrendasByCompany = async (id) => {

    const items = await knex.select().from(this.nombreColeccion).where({ "name": "Prendas" }).where({ "empresa_id": id })
    return items;
  };
  getProductos = async () => {

    const items = await knex.select().from(this.nombreColeccion).whereNot({ "categoria": 9999 })
    return items;
  };
  getProductosByCompany = async (id) => {

    const items = await knex.select().from(this.nombreColeccion).whereNot({ "categoria": 9999 }).where({ "empresa_id": id })
    return items;
  };
  getCategories = async (id) => {

    const items = await knex.select("name", "id").from(this.nombreColeccion).whereNot({ "id": 9999 })
    return items;
  };
  getCategoriesByCompany = async (id) => {

    const items = await knex.select("name", "id").from(this.nombreColeccion).whereNot({ "id": 9999 }).where({ "empresa_id": id })
    return items;
  };
  getCategoriesFull = async (id) => {

    const items = await knex.select().from(this.nombreColeccion).whereNot({ "id": 9999 })
    return items;
  };
  getCategoriesByCompanyFull = async (id) => {

    const items = await knex.select().from(this.nombreColeccion).whereNot({ "id": 9999 }).where({ "empresa_id": id })
    return items;
  };
  getSubCategoriesPrenda = async (id) => {

    const items = await knex.select("nombre").from(this.nombreColeccion).where({ "id": 9999 })
    return items;
  };

  getCategoryPrendas = async () => {

    const items = await knex.select("id").from(this.nombreColeccion).where({ "name": "Prendas" })
    return items;
  };

  getNumberCategory = async (id) => {

    const items = await knex.select("id").from(this.nombreColeccion).where({ "name": "Prendas" }).where({ "empresa_id": id })
    return items;
  };

  getSubCategoriesByCompanyPrenda = async (id) => {

    const items = await knex.select("nombre").from(this.nombreColeccion).where({ "id": 9999 }).where({ "empresa_id": id })
    return items;
  };

  getCategoriesRegister = async () => {
    await this.checkExist();
    const items = await knex.select("categoria").from(this.nombreColeccion).timeout(1000);
    return items;
  };

  countByCompany = async (id) => {

    const items = await knex.count('id').from(this.nombreColeccion).where({ "empresa_id": id })
    return items;
  };
  getCountByCompany = async (id) => {
    return knex.count().from(this.nombreColeccion).where("empresa_id", id);
  };
  getLimitGalery = async (id) => {
    return knex.select().from(this.nombreColeccion).where("empresa_id", id).orderBy('id', 'desc').limit(16).offset(0)
  }
  getLimitGaleryAll = async (id, count) => {
    return knex.select().from(this.nombreColeccion).where("empresa_id", id).orderBy('id', 'desc').limit(16).offset(count)
  }
  deleteByMedia = (id) => {
    const item = knex
      .del()
      .from(this.nombreColeccion)
      .where({ media_id: id })

    return item;
  };
  getbyUserCompany = async (id) => {

    return knex.select("empresa_id").from(this.nombreColeccion).where("usuario_id", id);
  };

  getModulesByCompany = async (id) => {
    const items = await knex.select("modulo").from(this.nombreColeccion).where({ "empresa_id": id })
    return items;
  };

  getCompanyAndModules = async () => {
    const items = await knex.select('*')
      .from(this.nombreColeccion).whereNot("id", 0)
      .leftJoin('modulos_habilitado', 'modulos_habilitado.empresa_id', 'empresas_marketplace.id')
    return items;
  };
  checkLastNumber = async () => {
    return knex.select("id_grupo")
      .from(this.nombreColeccion).orderBy('id_grupo', 'desc').limit(1)
  }

  getNameModulesAll = async () => {
    const items = await knex.select()
      .from(this.nombreColeccion)
      .leftJoin('modulos_categorias', 'modulos_categorias.id', 'modulos_grupo.modulos')
    return items;
  };

  getCompany = async (id) => {

    const items = await knex.select("empresa_id").from(this.nombreColeccion).where({ "usuario_id": id })
    return items;
  };
  checkExistModuleGroup = async (id) => {
    return knex.select("id_grupo")
      .from(this.nombreColeccion)

      .where({ "empresa_id": id });
  }
  checkExistModuleGroupName = async (id, nombre) => {
    return knex.select("id_grupo")
      .from(this.nombreColeccion)

      .where({ "empresa_id": id })
      .where({ "nombre": nombre });
  }

  getNameCityAndPlaces = async () => {
    const items = await knex.select()
      .from(this.nombreColeccion)
      .leftJoin('ciudad', 'regiones_entrega_grupo.ciudadID', 'ciudad.CiudadID')

    return items;
  };

  getImagenByGroup = async (id) => {
    const items = await knex.select("galeriaFotos")
      .from(this.nombreColeccion).where("id", id)
       

    return items;
  };


  getCityByGroup = async (id) => {
    const items = await knex.select()
      .from(this.nombreColeccion).where("id_grupo", id)
      .leftJoin('ciudad', 'regiones_entrega_grupo.ciudadID', 'ciudad.CiudadID')

    return items;
  };

  getNameModulesCompany = async (id) => {
    const items = await knex.select()
      .from(this.nombreColeccion).where({ "id_grupo": id })
      .leftJoin('modulos_categorias', 'modulos_categorias.id', 'modulos_grupo.modulos')

    return items;
  };


  getIdModulesCompany = 
  async (id) => {
    const items = await knex.select("modulos")
      .from(this.nombreColeccion).where({ "id_grupo": id })
      .leftJoin('modulos_categorias', 'modulos_categorias.id', 'modulos_grupo.modulos')

    return items;
  };
  getModulesByCategories = async (array) => {
    try {
      const items = await knex.select().from(this.nombreColeccion).whereIn("categoria_id", array)

      return items;
    } catch (error) {
      logger.error("Error al obtener modulos", error)
    }

  };
  count = async () => {
    const items = await knex.count('id').from(this.nombreColeccion)
    return items;
  };
  deleteById = (id) => {
    const item = knex
      .del()
      .from(this.nombreColeccion)
      .where({ id })
      .timeout(1000);

    return item;
  };
  deleteByIdServicio = (id) => {
    const item = knex
      .del()
      .from(this.nombreColeccion)
      .where({ id_servicio: id })
      .timeout(1000);

    return item;
  };
  deleteByConditionDoc = (id) => {
    const item = knex
      .del()
      .from(this.nombreColeccion)
      .where({ nro_documento: id })
      .timeout(1000);

    return item;
  };
  getById = async (id) => {
    const items = await knex.select().from(this.nombreColeccion).where({ id });
    return items;
  };

  getByIdProduct = async (id) => {
    const items = await knex.select().from(this.nombreColeccion).where({ id });

    return items;
  };

  getByIdUrl = async (id) => {
    const items = await knex.select("url").from(this.nombreColeccion).where({ id });

    return items;
  };

  updateById = async (id, body) => {
    const items = await knex
      .update(body)
      .from(this.nombreColeccion)
      .where({ id });

    return items;
  };
  updateByCompanyId = async (id, body) => {
    const items = await knex
      .update(body)
      .from(this.nombreColeccion)
      .where({ empresa_id: id });

    return items;
  };
  updateByCompanyIdAndMethod = async (id, met_id, body) => {
    const items = await knex
      .update(body)
      .from(this.nombreColeccion)
      .where({ empresa_id: id })
      .where({ metodo_id: met_id });

    return items;
  };
  updateByCompanyIdAndName = async (id, nombre, body) => {
    const items = await knex
      .update(body)
      .from(this.nombreColeccion)
      .where({ empresa_id: id })
      .where({ nombre: nombre });

    return items;
  };
  updateByIdAndName = async (id, nombre, body) => {
    const items = await knex
      .update(body)
      .from(this.nombreColeccion)
      .where({ id: id })
      .where({ nombre: nombre });

    return items;
  };

  /**
   * Actualizar varios datos, PDT: siempre agregar un where a este metodo.
   * this.service.updateBy({...}).where(condicion)
   */
  updateBy = (body) => {
    return knex.update(body).from(this.nombreColeccion);
  }

  saveAll = async (fieldsToInsert) => {
    return knex(this.nombreColeccion).insert(fieldsToInsert);
  };
  save = async (body) => {
    return await knex.insert(body).into(this.nombreColeccion);
  };

  /**
   * Guardar varios datos, se usa this.service.saveBy().insert([...])
   */
  saveBy = () => {
    return knex.from(this.nombreColeccion);
  }

  getbyCondition = async (id) => {
    return knex.select().from(this.nombreColeccion).where("id", id);
  };
  getbyCompany = async (id) => {

    return knex.select().from(this.nombreColeccion).where("empresa_id", id);
  };

  getbyCountry = async (pais) => {

    return knex.select().from(this.nombreColeccion).where("PaisCodigo", pais)
  };

  getByCity = async (pais) => {

    return knex.select("CiudadDistrito").from(this.nombreColeccion).where("CiudadNombre", pais)
  };
  getByCityID = async (pais) => {

    return knex.select().from(this.nombreColeccion).where("CiudadID", pais)
  };

  getByPedido = async (id) => {

    return knex.select().from(this.nombreColeccion).where("id_pedido", id).leftJoin('productos', 'productos.id', 'pedido_productos.id_producto')
  };

  getbyCompany_Invoices = async (empresa_id, tipo) => {

    return knex.select().from(this.nombreColeccion).where("empresa_id", empresa_id).where("tipo", tipo).orderBy('id', 'desc').limit(1)
  };
  getbyCompanyAndGetId = async (id) => {

    return knex.select("name", "id").from(this.nombreColeccion).where("empresa_id", id);
  };



  getbyEmail = async (id) => {

    return knex.select().from(this.nombreColeccion).where("correo", id);
  };


  getbyCompanyHome = async (id) => {

    return knex.select().from(this.nombreColeccion).where("empresa_id", id).limit(4);
  };

  getByCategorie = async (cat) => {

    return knex.select().from(this.nombreColeccion).where("categoria", cat).limit(4);
  };

  getUsersBycompany = async (array) => {

    return knex.select().from(this.nombreColeccion).whereIn("id", array)
  }


  getUsersBycompanySelect = async (array) => {

    return knex.select("correo", "nombre", "apellido", "ip", "ultima_conexion", "device", "platform", "session_status", "browser").from(this.nombreColeccion).whereIn("id", array)
  }

  checkExistUser = async (email) => {

    return knex.select()
      .from(this.nombreColeccion)
      .where({ correo: email })
      .timeout(1000);
  }

  // Others

  getSelectColumns = (columns) => {
    return knex.select(...columns)
      .from(this.nombreColeccion)
    // .timeout(1000)
  }

  getSelectColumnsById = (id, columns) => {
    return knex.select(...columns)
      .from(this.nombreColeccion)
      .where({ id })
  }

  saveRow = (columns) => {
    return knex.returning(['id'])
      .insert(columns)
      .into(this.nombreColeccion)
  }

  getTable = () => {
    return knex.from(this.nombreColeccion)
  }

  // End Others

  checkExistCompanyAndName = async (id, nombre) => {
    return knex.select()
      .from(this.nombreColeccion)
      .where({ empresa_id: id })
      .where({ nombre: nombre });
  };
  checkExistCompanyAndNameCateg = async (id, nombre) => {
    return knex.select()
      .from(this.nombreColeccion)
      .where({ empresa_id: id })
      .where({ name: nombre });


  };

  checkExistInsumo = async (empresa_id, insumo) => {

    return knex.select()
      .from(this.nombreColeccion)
      .where({ insumo: insumo })
      .where({ empresa_id: empresa_id })



  }

  checkModulos = async (cat) => {
    return knex.select()
      .from(this.nombreColeccion)
      .where({ categoria: cat })

  }
  getByOferta = async (id) => {
    return knex.select().from(this.nombreColeccion).where("empresa_id", id).where('is_oferta', '1').limit(8);
  };
  getbyUser = async (id) => {
    return knex.select().from(this.nombreColeccion).where("id", id);
  };
  getByName = async (name) => {
    return knex.select().from(this.nombreColeccion).where("nombre", name);
  };
  getByColumn = ({ column, value }) => {
    return knex.select().from(this.nombreColeccion).where(column, value)
  };

  checkExistUser = async (user) => {
    try {
      return knex.select()
        .from(this.nombreColeccion)
        .where({ "correo": user });

    } catch (error) {
      logger.error("ERROR", error)
    }
  }

  checkExistCategory = async (cat) => {
    return knex.select()
      .from(this.nombreColeccion)
      .where({ "categoria": cat });
  }

  checkExistCompany = async (id) => {
    return knex.select()
      .from(this.nombreColeccion)
      .where({ "empresa_id": id });
  }
  checkExistCompanyAndMethod = async (id, val) => {
    return knex.select()
      .from(this.nombreColeccion)
      .where({ "empresa_id": id })
      .where({ "metodo_id": val });
  }
  checkExistCompanyAndId = async (id, val) => {
    return knex.select()
      .from(this.nombreColeccion)
      .where({ "empresa_id": id })
      .where({ "id": val });
  }
  getbyInvoice = async (id) => {
    return knex.select().from(this.nombreColeccion).where("id_cotizacion", id);
  };
  saveCustomer = async (data) => {
    return knex
      .select("email")
      .from(this.nombreColeccion)
      .where("email", data.email)

      .then((userNameList) => {
        if (!userNameList.length) {
          knex(this.nombreColeccion).insert([
            {
              nombre: data.nombre,
              email: data.email,
              empresa_id: data.empresa_id,
            },
          ]).then();
        } else {
          throw "Error ya existe";
        }
      });
  };

  deleteByGroup = async (id) => {
    const item = knex
      .del()
      .from(this.nombreColeccion)
      .where({ id_grupo: id })
      .timeout(1000);


    return item;
  };

  deleteByGroupImagen = async (media_id, grupo_id) => {
    const item = knex
      .del()
      .from(this.nombreColeccion)
      .where({ id_grupo: grupo_id })
      .where({ media_id: media_id })

    return item;
  };

  deleteByConditionCot = async (id) => {
    const item = knex
      .del()
      .from(this.nombreColeccion)
      .where({ id_cotizacion: id })
      .timeout(1000);

    return item;
  };
  deleteByUsuario = async (id) => {
    const item = knex
      .del()
      .from(this.nombreColeccion)
      .where({ empresa_id: id })
      .timeout(1000);

    return item;
  };

  deleteBy = () => {
    return knex.del().from(this.nombreColeccion);
  }

  actualizarEstadoEnviado = async (estado, id) => {
    const item = knex
      .update({ enviado: estado })
      .from(this.nombreColeccion)
      .where({ id })
      .timeout(2000);

    return item;
  };
  mostrarEmail = async (email) => {

    const item = knex

      .from(this.nombreColeccion)
      .where({ email_corporativo: email })
      .timeout(2000);

    return item;


  };
  actualizarEstadoFacturado = async (estado, id) => {
    const item = knex
      .update({ facturado: estado })
      .from(this.nombreColeccion)
      .where({ id })
      .timeout(2000);

    return item;
  };
  actualizarEstadoAceptado = async (estado, id) => {
    const item = knex
      .update({ aceptado: estado })
      .from(this.nombreColeccion)
      .where({ id })
      .timeout(2000);

    return item;
  };
  actualizarLogoEmpresaId = async (body, id) => {

    const item = knex
      .update({ logo: body.logo })
      .from(this.nombreColeccion)
      .where({ empresa_id: id })
    return item;
  };

  actualizarEmpresaId = async (body, id) => {

    const item = knex
      .update(body)
      .from(this.nombreColeccion)
      .where({ empresa_id: id })
    return item;
  };

  buscarUrl = async (url) => {

    const item = knex
      .select("public_id")
      .from(this.nombreColeccion)
      .where({ url: url })
    return item;
  };

  //acciones masivas
  eliminarIds = async (arr) => {
    const item = knex
      .del()
      .from(this.nombreColeccion)
      .whereIn("id", arr)
      .timeout(1000);

    return item;
  };
  borrador = async (arr) => {
    const item = knex
      .update({ activado: 0 })
      .from(this.nombreColeccion)
      .whereIn("id", arr)
      .timeout(2000);

    return item;
  };
  publicar = async (arr) => {
    const item = knex
      .update({ activado: 1 })
      .from(this.nombreColeccion)
      .whereIn("id", arr)
      .timeout(2000);

    return item;
  };
  crearTablaRegistrados = async () => {
    return knex.schema
      .createTable(this.nombreColeccion, (table) => {
        table.increments();
        table.string("nombre_empresa");
        table.string("correo_electronico");
        table.string("contrasena");

        table
          .dateTime("created_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

        table
          .dateTime("updated_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };
  crearTablaCategoriasModulos = async () => {
    return knex.schema
      .createTable(this.nombreColeccion, (table) => {
        table.increments();
        table.string("categoria");
        table.string("modulos");
        table
          .dateTime("created_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

        table
          .dateTime("updated_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };
  crearTablaEmpresaCategorias = async () => {
    return knex.schema
      .createTable(this.nombreColeccion, (table) => {
        table.increments();
        table.string("categoria");
        table.string("empresa_id");
        table
          .dateTime("created_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

        table
          .dateTime("updated_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };
  crearTablaCotizacionDetalle = async () => {
    return knex.schema
      .createTable(this.nombreColeccion, (table) => {
        table.increments();
        table.string("id_cotizacion");
        table.string("producto");
        table.string("descripcion");
        table.string("precio");
        table.string("cantidad");
        table.string("impuesto");
        table.string("impuesto2");
        table.string("impuesto_total");
        table.string("total");
        table
          .dateTime("created_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

        table
          .dateTime("updated_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };
  crearTablaNuevaCotizacion = async () => {
    return knex.schema
      .createTable(this.nombreColeccion, (table) => {
        table.increments();
        table.string("titulo_cotizacion");
        table.string("cliente_nombre");
        table.string("cliente_email");
        table.string("fecha_vencimiento");
        table.string("terminos_pago");
        table.string("nota_comentarios");
        table.string("nota_terminos");
        table.string("subtotal_general");
        table.string("impuestos_general");
        table.string("descuento");
        table.string("descuento_porcentaje");
        table.string("total_general");
        table.string("empresa_id").defaultTo(0)
        table.boolean("enviado").notNullable().defaultTo(0);
        table.boolean("aceptado").notNullable().defaultTo(0);
        table.boolean("facturado").notNullable().defaultTo(0);
        table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        table
          .dateTime("updated_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then(v => logger.info(v)).catch(e => logger.error(e));
  };

  crearTablaCotizacionServicios = async () => {
    return knex.schema
      .createTable(this.nombreColeccion, (table) => {
        table.increments();
        table.string("name");
        table.string("description");
        table.string("precio");
        table.string("empresa_id").defaultTo(0);
        table
          .dateTime("updated_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };
  crearTablaMarket = async () => {
    return knex.schema
      .createTable(this.nombreColeccion, (table) => {
        table.increments();
        table.string("habilitado");

        table
          .dateTime("updated_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };
  crearTablaCotizacionCliente = async () => {
    return knex.schema
      .createTable(this.nombreColeccion, (table) => {
        table.increments();
        table.string("empresa_id").defaultTo(0);
        table.string("nombre");
        table.string("email");
        table
          .dateTime("updated_at")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };
  crearTablaAlmacen = async () => {
    return knex.schema.createTable("almacenes", (table) => {
      table.increments();
      table.string("nombre");
      table.string("direccion");
      table.string("provincia");
      table.string("pais");
      table.string("empresa_id").defaultTo(0)
      table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));

      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    });
  };

  crearTablaPersonal = async (name) => {
    return knex.schema
      .createTable(name, (table) => {
        table.increments();
        table.string("nombre");
        table.string("tipo_documento").notNullable();
        table.string("nro_documento").notNullable();
        table.string("monto").notNullable();
        table.string("tipo_de_pago").notNullable();
        table.string("empresa_id").defaultTo(0);
        table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };


  crearTablaNuevoPersonal = async (name) => {
    return knex.schema
      .createTable(name, (table) => {
        table.increments();
        table.string("nombre");
        table.string("tipo_documento").notNullable();
        table.string("nro_documento").notNullable();
        table.string("empresa_id").defaultTo(0);
        table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));

        table
          .timestamp("updated_at")
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };

  crearTablaPagoProveedores = async (name) => {
    return knex.schema
      .createTable(name, (table) => {
        table.increments();
        table.string("nombre_proveedor");
        table.string("insumo");
        table.string("cuit");
        table.string("monto");
        table.string("empresa_id").defaultTo(0);
        table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        table
          .timestamp("updated_at")
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };
  crearTablaInsumos = async (name) => {
    return knex.schema
      .createTable(name, (table) => {
        table.increments();
        table.string("insumo");
        table.string("empresa_id").defaultTo(0);
        table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));

        table
          .timestamp("updated_at")
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };
  crearTablaCotizacionImpuestos = async (name) => {
    return knex.schema
      .createTable(name, (table) => {
        table.increments();
        table.string("nombre");
        table.string("tasa");
        table.string("empresa_id").defaultTo(0);
        table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));

        table
          .timestamp("updated_at")
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };
  crearTablaStock = async (name) => {
    return knex.schema
      .createTable(name, (table) => {
        table.increments();
        table.string("producto_id");
        table.string("almacen_id");
        table.string("stock");
        table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));

        table
          .timestamp("updated_at")
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };
  crearTablaEmpresas = async (name) => {
    return knex.schema
      .createTable(name, (table) => {
        table.increments();
        table.string("empresa_id");
        table.string("nombre");
        table.string("razon_social");
        table.string("whatsapp_corporativo");
        table.string("facebook_corporativo");
        table.string("youtube_corporativo");
        table.string("twitter_corporativo");
        table.string("instagram_corporativo");
        table.string("email_corporativo");
        table.string("direccion");

        table.string("nombre_contacto");
        table.string("celular_contacto");
        table.string("email_contacto");
        table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        table
          .timestamp("updated_at")
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };
  crearTablaProveedores = async (name) => {
    return knex.schema
      .createTable(name, (table) => {
        table.increments();
        table.string("nombre");
        table.string("razon_social");
        table.string("ruc");
        table.string("email_corporativo");
        table.string("direccion");
        table.string("telefono_corporativo");
        table.string("nombre_contacto");
        table.string("telefono_contacto");
        table.string("email_contacto");

        table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        table
          .timestamp("updated_at")
          .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      })
      .then();
  };

  // Tablas modulos_tv

  crearTablaProgramas = async (name) => {
    return await new Promise(async (resolve, reject) => {
      try {
        await knex.schema.createTable(name, function (table) {
          table.increments();
          table.string('nombre').notNullable();
          table.string('slogan');
          table.text('estracto');
          table.string('foto_portada').notNullable();
          table.integer('num_temporadas', 5);
          table.integer('id_genero').unsigned();
          table.integer('id_productora').unsigned();
          table.integer('id_director').unsigned();
          table.string('fecha_lanzamiento');
          table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
          table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        });
        return resolve({
          msg: `La tabla ${name} fue creada exitosamente`
        })
      } catch (error) {
        return reject(error)
      } 
    })
  }

  crearTablePeople = async (name) => {
    return await new Promise(async (resolve, reject) => {
      try {
        await knex.schema.createTable(name, function (table) {
          table.increments();
          table.string('nombre').notNullable();
          table.string('nacionalidad');
          table.text('biografia');
          table.string('fecha_nacimiento');
          table.string('genero');
          table.datetime('created_at').defaultTo(knex.fn.now(6));
          table.datetime('updated_at').defaultTo(knex.fn.now(6));
        });

        return resolve({
          msg: `La tabla ${name} fue creada exitosamente`
        })
      } catch (error) {
        return reject(error)
      }
    })
  }
}

module.exports = ServiceSQL;
