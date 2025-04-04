import { Router } from "express";
import { addToCart, getAll, updateCart, deleteCart } from "../controllers/cart.controller.js";

const router = Router()

// router.use(passport.authenticate("jwt", {session : false}))
router.post('/', addToCart)
router.get('/', getAll)
router.put('/:id', updateCart)
router.delete('/:id', deleteCart)

export default router