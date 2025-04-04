import assert from 'node:assert'
import sinon from 'sinon'
import * as controller from '../controllers/product.controller.js'
import models from '../db/db.js'

// Test de la route getAll

describe('Product Controller - **getAll**', function () {
    let req, res, findAllStub

    this.beforeEach(() => {
        req = {}
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            sendStatus: sinon.stub()
        }
    })

    this.afterEach(() => {
        if ( findAllStub ) {
            findAllStub.restore()
        }
    })

    it('Devrait retourner la liste des produits', async function() {
        const fakeProducts = [
            {
                id : 1,
            name : 'Produit1',
            },
            {
                id : 2,
            name : 'Produit2',
            }
        ]
        findAllStub = sinon.stub(models.Product, 'findAll').resolves(fakeProducts)

        await controller.getAll(req, res)

        assert.ok(findAllStub.calledOnce)
        assert.ok(res.status.calledWith(200))
        assert.ok(res.json.calledWith({
            status: 200,
            msg: 'Ok',
            result: fakeProducts
        }))
    })

    it('devrait retourner 404 si aucun produit trouvé', async function () {
        findAllStub = sinon.stub(models.Product, 'findAll').resolves([])
    
        await controller.getAll(req, res)
    
        assert.ok(res.status.calledWith(200))
        assert.ok(res.json.calledWith({
          status: 200,
          msg: 'Pas de produits trouvés'
        }))
      })
    
    it('devrait gérer les erreurs internes (500)', async function () {
    findAllStub = sinon.stub(models.Product, 'findAll').rejects(new Error('erreur'))

    await controller.getAll(req, res)

    assert.ok(res.sendStatus.calledWith(500))
    })
})

// Test de la route getOne

describe('Product Controller - getOne', function () {
    let req, res, findByPkStub
  
    beforeEach(() => {
      req = { params: { id: 1 } }
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        sendStatus: sinon.stub()
      }
    })
  
    afterEach(() => {
      if (findByPkStub) findByPkStub.restore()
    })
  
    it('retourne un produit si trouvé', async function () {
      const product = { id: 1, name: 'Produit test' }
      findByPkStub = sinon.stub(models.Product, 'findByPk').resolves(product)
  
      await controller.getOne(req, res)
  
      assert.ok(res.status.calledWith(200))
      assert.ok(res.json.calledWith({
        status: 200,
        msg: 'Ok',
        result: product
      }))
    })
  
    it('retourne 404 si produit non trouvé', async function () {
      findByPkStub = sinon.stub(models.Product, 'findByPk').resolves(null)
  
      await controller.getOne(req, res)
  
      assert.ok(res.status.calledWith(404))
      assert.ok(res.json.calledWith({
        status: 404,
        msg: 'Pas de produit trouvé'
      }))
    })
  
    it('retourne 500 en cas d\'erreur', async function () {
      findByPkStub = sinon.stub(models.Product, 'findByPk').rejects([])
      try {
          await controller.getOne(req, res)
      } catch (error) {
        
      }
        
  
      assert.ok(res.sendStatus.calledWith(500))
    })
  })
    

// Test de la route addProduct

describe('Product Controller - addProduct', function () {
    let req, res, productSaveStub
  
    beforeEach(() => {
      req = {
        body: { name: 'Produit Test', price: 10 },
        files: {
          image01: [{ filename: 'image1.jpg' }],
          image02: [{ filename: 'image2.jpg' }],
          image03: [{ filename: 'image3.jpg' }],
        },
        protocol: 'http',
        get: () => 'localhost:8000' //
      }
  
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        sendStatus: sinon.stub()
      }
    })
  
    afterEach(() => {
      sinon.restore()
    })
  
    it('devrait créer et sauvegarder un produit', async function () {
      const fakeSavedProduct = { id: 1, name: 'Produit Test' }
      productSaveStub = sinon.stub().resolves(fakeSavedProduct)
      const productConstructorStub = sinon.stub(models, 'Product').returns({ save: productSaveStub })
  
      await controller.addProduct(req, res)
  
      assert.ok(productConstructorStub.calledOnce)
      assert.ok(productSaveStub.calledOnce)
      assert.ok(res.status.calledWith(201))
      assert.ok(res.json.calledWith({
        status: 201,
        msg: 'Ok',
        result: fakeSavedProduct
      }))
  
      productConstructorStub.restore()
    })
  
    it('devrait gérer les erreurs et retourner 500', async function () {
      productSaveStub = sinon.stub().rejects([])
      const productConstructorStub = sinon.stub(models, 'Product').returns({ save: productSaveStub })
  
      await controller.addProduct(req, res)
  
      assert.ok(res.sendStatus.calledWith(500))
      productConstructorStub.restore()
    })
  })

//   Test updateOne

describe('Product Controller - updateOne', function () {
    let req, res, findByPkStub, saveStub
  
    beforeEach(() => {
      req = {
        params: { id: 1 },
        body: { name: 'Produit modifié', price: 20 }
      }
  
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        sendStatus: sinon.stub()
      }
    })
  
    afterEach(() => {
      sinon.restore()
    })
  
    it('devrait mettre à jour un produit existant', async function () {
        const product = {
          id: 1,
          name: 'produit1',
          price: 10,
          save: sinon.stub().resolvesThis()
        }
      
        const findByPkStub = sinon.stub(models.Product, 'findByPk').resolves(product)
      
        req = {
          params: { id: 1 },
          body: { name: 'produit5', price: 20 }
        }
      
        await controller.updateOne(req, res)
      
        // Teste que les valeurs ont été affectées au produit
        assert.strictEqual(product.name, 'produit5')
        assert.strictEqual(product.price, 20)
        assert.ok(product.save.calledOnce)
      
        // Teste la réponse
        assert.ok(res.status.calledWith(200))
        assert.ok(res.json.calledWith({
          status: 200,
          msg: 'Produit mis à jour',
          result: product
        }))
      
        findByPkStub.restore()
      })
  
    it('devrait retourner 404 si produit introuvable', async function () {
      findByPkStub = sinon.stub(models.Product, 'findByPk').resolves(null)
  
      await controller.updateOne(req, res)
  
      assert.ok(res.status.calledWith(404))
      assert.ok(res.json.calledWith({
        status: 404,
        msg: 'Pas de produit trouvé'
      }))
    })
  
    it('devrait retourner 500 en cas d\'erreur', async function () {
      findByPkStub = sinon.stub(models.Product, 'findByPk').rejects([])
  
      await controller.updateOne(req, res)
  
      assert.ok(res.sendStatus.calledWith(500))
    })
  })

//   Test de deleteOne

describe('Product Controller - deleteOne', function () {
    let req, res, destroyStub
  
    beforeEach(() => {
      req = { params: { id: 1 } }
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        sendStatus: sinon.stub()
      }
    })
  
    afterEach(() => {
      if (destroyStub) destroyStub.restore()
    })
  
    it('devrait supprimer un produit existant', async function () {
      destroyStub = sinon.stub(models.Product, 'destroy').resolves(1) // 1 ligne supprimée
  
      await controller.deleteOne(req, res)
  
      assert.ok(destroyStub.calledWith({ where: { id: 1 } }))
      assert.ok(res.status.calledWith(200))
      assert.ok(res.json.calledWith({
        status: 200,
        msg: 'Produit supprimé'
      }))
    })
  
    it('devrait retourner 404 si aucun produit supprimé', async function () {
      destroyStub = sinon.stub(models.Product, 'destroy').resolves(0) // aucun produit supprimé
  
      await controller.deleteOne(req, res)
  
      assert.ok(res.status.calledWith(404))
      assert.ok(res.json.calledWith({
        status: 404,
        msg: 'Ce produit n\'existe pas'
      }))
    })
  
    it('devrait retourner 500 en cas d\'erreur', async function () {
      destroyStub = sinon.stub(models.Product, 'destroy').rejects([])
  
      await controller.deleteOne(req, res)
  
      assert.ok(res.sendStatus.calledWith(500))
    })
  })