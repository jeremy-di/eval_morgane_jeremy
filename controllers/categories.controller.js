import { Sequelize } from "sequelize";
import models from '../db/db.js'

async function getCategories(req, res) {
    models.Product.findAll({
        attributes: [
            ['category', 'nom'],
            [Sequelize.fn('COUNT', Sequelize.col('category')), 'compte']
        ],
        group: ['category']
    })
    .then(results => res.status(200).json(results))
    .catch(error => res.status(500).json({msg: 'Erreur serveur', error: error.message}))
}

export { getCategories }