const { response } = require('express');
const ServiceSQL = require('../services/services');

const getSidebarData = async (req, res = response) => {

    try {
        const modulos = await new ServiceSQL('modulos').getAll();
        const categorias = await new ServiceSQL('modulos_categorias').getAll();

        const data = categorias.map(categoria => ({
            ...categoria,
            items: modulos.filter(modulo => Number(modulo.categoria_id) === Number(categoria.id) && Number(modulo.activo) === 1)
        }));

        res.status(200).json({
            data
        });

    } catch (error) {

        res.status(500).json({
            error
        });
    }

}


module.exports = {
    getSidebarData
}