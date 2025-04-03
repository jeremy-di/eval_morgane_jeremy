import { Router } from "express";
import { addProduct, getAll, getOne, updateOne, deleteOne } from "../controllers/product.controller.js";
import multer from "../middlewares/multer.js";
import passport from "passport";

const router = Router()

router.use(passport.authenticate("jwt", {session : false}))
router.post('/add', multer, addProduct)
router.get('/all', getAll)
router.get('/:id', getOne)
router.put('/update/:id', updateOne)
router.delete('/delete/:id', deleteOne)

export default router