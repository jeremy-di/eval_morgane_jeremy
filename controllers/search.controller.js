import { Op } from 'sequelize'
import models from '../db/db.js'

async function searchProduct(req, res) {
    if ( !req.query.q?.trim() ) {
        return res.status(400).json({status: 400, msg: "Requête vide ou invalide"})
    }

    await models.Product.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.like]: `%${req.query.q}%` } },
                { category: { [Op.like]: `%${req.query.q}%` } }
            ]
        },
        attributes: ['id', 'category', 'name', 'description', 'image01', 'price']
    })
    .then(results =>
        results.length === 0
        ? res.status(404).json({status: 404, msg: "Aucun produit trouvé"})
        : res.status(200).json(results)
    )
    .catch(error => res.status(500).json({status: 500, msg: "erreur Serveur", error: error.message}))
}

export { searchProduct }