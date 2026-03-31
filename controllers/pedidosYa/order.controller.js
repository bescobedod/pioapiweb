const PedidosYa = require('../../models/pedidosYa/order.model');
const initTiendaModulo = require('../../models/pdv/views/vwTiendasModulo.view');
const { sequelizeInit } = require('../../configuration/db');
const { Op } = require('sequelize')

async function getOrdersDynamic(req, res) {
    const { empresa, tienda, fechaInicio, fechaFin, nit } = req.params;
    
    try {
        let query = {};

        if (empresa && empresa !== '0' && empresa !== 'all') {
            query.empresa = empresa;
        }

        if (tienda && tienda !== '0' && tienda !== 'all') {
            query.tienda = tienda;
        }

        if (nit && nit !== '0' && nit !== 'all' && nit !== '') {
            query['orderData.corporateTaxId'] = new RegExp(`^${nit}$`, 'i');
        }

        const isValido = (v) => v && v !== '0' && v !== 'all' && v !== '';
        if (isValido(fechaInicio) && isValido(fechaFin)) {
            const start = new Date(fechaInicio);
            const end = new Date(fechaFin);
            
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                end.setHours(23, 59, 59, 999);
                query.fecha = { $gte: start, $lte: end };
            }
        }

        const orders = await PedidosYa.find(query).sort({ fecha: -1 }).limit(200);

        if (orders.length === 0) return res.json([]);

        const codigosTiendasArr = [...new Set(orders.map(o => o.tienda))];
        
        const sequelizePDV = await sequelizeInit('PDV');
        const TiendaModuloModel = initTiendaModulo(sequelizePDV);
        
        const infoTiendas = await TiendaModuloModel.findAll({
            attributes: ['codigo_tienda', 'nombre_tienda', 'nombre_empresa', 'codigo_empresa'],
            where: {
                codigo_tienda: { [Op.in]: codigosTiendasArr }
            },
            raw: true
        });

        const ordersConNombres = orders.map(order => {
            const orderObj = order.toObject();
            const totalDescuento = (orderObj.orderData?.discounts || []).reduce((acc, disc) => {
                const valor = parseFloat(disc.amount) || 0;
                return acc + valor;
            }, 0); 
            const metadatos = infoTiendas.find(t => 
                t.codigo_tienda === order.tienda && 
                t.codigo_empresa === order.empresa
            );

            return {
                ...orderObj,
                total_descuento: totalDescuento,
                nombre_tienda: metadatos ? metadatos.nombre_tienda : 'Tienda no encontrada',
                nombre_empresa: metadatos ? metadatos.nombre_empresa : 'Empresa no encontrada'
            };
        });

        return res.json(ordersConNombres);

    } catch (err) {
        console.error("Error en getOrdersDynamic:", err);
        return res.status(500).json({
            error: 'Error al realizar la búsqueda dinámica de órdenes',
            details: err.message
        });
    }
}

module.exports = {
    getOrdersDynamic
};