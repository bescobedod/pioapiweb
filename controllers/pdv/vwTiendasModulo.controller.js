const initTiendaModulo = require('../../models/pdv/views/vwTiendasModulo.view');
const { sequelizeInit } = require('../../configuration/db');
const { Op } = require('sequelize')

//Obtener todas las tiendas que tengas coordenadas GPS establecidas
async function getAllTiendas(req, res) {
    const { cod_tienda } = req.params; //Se excluye tienda enviada como parámetro de las tiendas obtenidas
    try {
        const sequelizePDV = await sequelizeInit('PDV');
        const TiendaModuloModel = initTiendaModulo(sequelizePDV);
        const tiendas = await TiendaModuloModel.findAll({
            attributes: [
                'id_tienda',
                'codigo_tienda',
                'codigo_empresa',
                'nombre_tienda',
                'nombre_empresa',
                'direccion_tienda',
                'inactiva',
                'altitud',
                'latitud',
                'division'
            ],
            where: {
                inactiva: false,
                altitud:  {
                    [Op.not]: [""]
                },
                latitud:  {
                    [Op.not]: [""]
                },
                codigo_tienda: {
                    [Op.not]: cod_tienda
                }
            },
            raw: true
        });
        return res.json(tiendas);
    } catch (err) {
        return res.status(500).json({ error: 'Error al obtener las tiendas', details: err.message });
    }
}

//Obtener tienda según codigo de tienda y codigo de empresa
async function getTiendaByIdAndEmpresa(req, res) {
    const { cod_tienda, cod_empresa } = req.params;
    try {
        const sequelizePDV = await sequelizeInit('PDV');
        const TiendaModuloModel = initTiendaModulo(sequelizePDV);
        const tienda = await TiendaModuloModel.findOne({
            where: {
                codigo_tienda: cod_tienda,
                codigo_empresa: cod_empresa
            },
            raw: true
        });
        return res.json(tienda);
    } catch (err) {
        return res.status(500).json({ error: 'Error al obtener las tiendas', details: err.message });
    }
}

module.exports = {
    getAllTiendas,
    getTiendaByIdAndEmpresa
};