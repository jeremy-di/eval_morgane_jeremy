import models from '../db/db.js'

async function addToCart(req, res) {
    try {
        const { productId, quantity = 1 } = req.body
        
        const existing = await models.Cart.findOne({
            where: { productId }
        })

        if ( existing ) {
            existing.quantity += quantity
            await existing.save()
        }
        else {
            await models.Cart.create({ productId, quantity })
        }

        res.status(200).json({status: 200, msg: "Produit ajouté au panier"})
    } catch (error) {
        res.status(500).json({msg: "Erreur serveur", error: error.message})
    }
}
async function getAll(req, res) {
    try {
        const cart = await models.Cart.findAll({
            include: [
                {
                    model: models.Product,
                    as: 'product',
                    attributes: ['id', 'category', 'description', 'price', 'image01']
                }
            ]
        })

        res.status(200).json({status: 200, cart})
    } catch (error) {
        res.status(500).json({status: 500, msg : 'Erreur serveur', error: error.message})
    }
}
async function updateCart(req, res) {
    try {
        const { productId } = req.params
        const { quantity } = req.body
        const cartItem = await models.Cart.findOne({
            where: productId
        })

        if ( !cartItem ) {
            return res.status(404).json({status: 404, msg : "Produit non trouvé dans le panier"})
        }

        cartItem.quantity = quantity
        await cartItem.save()
        res.status(200).json({status: 200, msg: "Quantité mise à jour"})
    } catch (error) {
        res.status(500).json({status: 500, msg : 'Erreur serveur', error: error.message})
    }

}
async function deleteCart(req, res) {}

export { addToCart, getAll, updateCart, deleteCart }