import models from '../db/db.js'

async function addProduct(req, res, next) {
    try {
        const { body } = req
        const product = await new models.Product({
            ...body,
            image01 : `${req.protocol}://${req.get('host')}/images/${req.files.image01[0].filename}`, 
            image02 : `${req.protocol}://${req.get('host')}/images/${req.files.image02[0].filename}`,
            image03 : `${req.protocol}://${req.get('host')}/images/${req.files.image03[0].filename}`,
        })
    const newProduct = await product.save()
    return res.status(201).json({status: 201, msg: "Ok", result: newProduct})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function getAll(req, res) {
    try {
        const productList = await models.Product.findAll()

        if ( productList.length == 0 ) {
            res.status(200).json({status: 200, msg : "Pas de produits trouvés"})
            return
        }

        res.status(200).json({status: 200, msg : "Ok", result: productList})
    } catch (error) {
        res.sendStatus(500)
    }
}

async function getOne(req, res) {
    try {
        const product = await models.Product.findByPk(req.params.id)
        if ( !product ) {
            res.status(404).json({status: 404, msg : "Pas de produit trouvé"})
        }

        res.status(200).json({status: 200, msg : "Ok", result: product})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function updateOne(req, res) {
    try {
        const updatedProduct = req.body

        const product = await models.Product.findByPk(req.params.id)
        if ( !product ) {
            res.status(404).json({status: 404, msg : "Pas de produit trouvé"})
            return
        }

        Object.assign(product, updatedProduct)
        const updateProduct = await product.save()
        res.status(200).json({status: 200, msg : "Produit mis à jour", result: updateProduct})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function deleteOne(req, res) {
    try {
        const { id } = req.params
        const product = await models.Product.destroy({where: { id: id }})

        if ( !product ) {
            res.status(404).json({status: 404, msg : "Ce produit n'existe pas"})
        }
        res.status(200).json({status: 200, msg : "Produit supprimé"})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { addProduct, getAll, getOne, updateOne, deleteOne }