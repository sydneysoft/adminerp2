const { Router } = require("express");
const router = Router();

const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require("../../../middlewares/EVResult.middleware");
const { check } = require("express-validator");

const { RegionEntregaController, RegionEntregaGrupoController, PaisController, CiudadController } = require("../../../controllers/modulo-generales/shipping");

const { service: RegionEntregaService } = RegionEntregaController;
const { service: RegionEntregaGrupoService } = RegionEntregaGrupoController

const { service: CiudadService } = CiudadController;
const { service: PaisService } = PaisController;

router.get("/", async (req, res) => {

  try {
    let { role, token, dataSession, dataSistema } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.render("modulo-generales/shipping/regiones/superadmin", {
        dataSession,
        dataSistema
      });
    }

    const regiones = await RegionEntregaService.getbyCompany(token);
    const ids_grupo = regiones.map((item) => item.id_grupo);
    let grupos = await RegionEntregaGrupoService.getTable().whereIn('id', ids_grupo)
      .leftJoin('ciudad', 'regiones_entrega_grupo.ciudadID', 'ciudad.CiudadID');
    let paises = await PaisService.getAll();

    let items = {
      paises: paises,
      grupos: grupos,
      regiones: regiones
    }

    return res.render("modulo-generales/shipping/regiones", {
      dataSession,
      dataSistema,
      items
    });

  } catch (error) {
    return catchError(req, error);
  }
});

router.get("/empresa/:id", async (req, res) => {
  try {
    const { dataSession, dataSistema } = await getAllDataSession(req);

    const regiones = await RegionEntregaService.getbyCompany(req.params.id);

    const ids_grupo = regiones.map((item) => item.id_grupo);
    let grupos = await RegionEntregaGrupoService.getTable().whereIn('id_grupo', ids_grupo)
      .leftJoin('ciudad', 'regiones_entrega_grupo.ciudadID', 'ciudad.CiudadID');

    let paises = await PaisService.getAll();

    let items = {
      paises: paises,
      grupos: grupos,
      regiones: regiones
    }

    return res.render("modulo-generales/shipping/regiones", {
      dataSession,
      dataSistema,
      empresa_id: req.params.id,
      items
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get("/distritos/:id", async (req, res) => {
  try {
    const city = req.params.id
    let distrito = await CiudadService.getByCity(city)

    res.status(200).json({
      distrito: distrito,
    })

  } catch (error) {
    return catchError(res, error);
  }
});


router.get("/ciudades/:id", async (req, res) => {
  const pais = req.params.id
  try {
    let ciudades = await CiudadService.getbyCountry(pais)

    res.status(200).json({
      ciudades: ciudades,
    });

  } catch (error) {
    return catchError(req, error);
  }
})


router.get("/obtener-ciudades/:id", async (req, res) => {
  try {
    const id_grupo = req.params.id
    let ciudades = await RegionEntregaGrupoService.getCityByGroup(id_grupo)
    res.status(200).json({
      ciudades: ciudades
    })
  } catch (error) {
    return catchError(req, error);
  }
});

router.get("/envio", async (req, res) => {
  try {
    let { role, token } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      token = req.query.empresa_id
    }

    const regiones = await RegionEntregaService.getbyCompany(token);

    let items = {
      regiones: regiones,
    }
    res.status(200).json({
      items: items, token: token
    })
  } catch (error) {
    return catchError(req, error);
  }
});

router.delete("/:id", RegionEntregaController.delete);

router.put("/:id", async (req, res) => {
  try {
    const {role, token} = await getAllDataSession(req);

    if (role == 3) {
      req.body.empresa_id = token;
    }
    const checkIdGroup = await RegionEntregaService.getTable()
      .where("id", req.params.id)
      .andWhere("empresa_id", req.body.empresa_id).select("id_grupo");
    if (Array.isArray(checkIdGroup) && checkIdGroup.length> 0) {
      const group_id = checkIdGroup[0].id_grupo
      await RegionEntregaGrupoService.deleteByGroup(group_id).then(() => {
        if (Array.isArray(req.body.states)) {
          req.body.states.map(async (state) => {
            await RegionEntregaGrupoService.save({ ciudadID: state, id_grupo: group_id });
          })
        }
      })
    }

    return res.json({
      status: "success",
      msg: "Actualizada correctamente",
    });

  } catch (error) {
    return catchError(res, error);
  }
});
router.post("/", async (req, res) => {
  try {
    const {role, token} = await getAllDataSession(req);
    if (role == 3) {
      req.body.empresa_id = token;
    }
    
    let last
    const checkLastGroup = await RegionEntregaGrupoService.checkLastNumber()
    if (checkLastGroup[0].id_grupo) {
      last = checkLastGroup[0].id_grupo
    } else {
      last = 0
    }
    const nuevoNumero = last + 1

    req.body.states.map(async (state) => {
      await RegionEntregaGrupoService.save({ ciudadID: state, id_grupo: nuevoNumero });

    })

    await RegionEntregaService.save({ empresa_id: req.body.empresa_id, nombre: req.body.nombre, id_grupo: nuevoNumero, pais: req.body.pais })


    res.json({
      status: "success",
      msg: "Actualizada correctamente",
    });



  } catch (error) {
    return catchError(req, error);
  }

});

module.exports = router;