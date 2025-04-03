import { Router } from "express";
import { searchProduct } from "../controllers/search.controller.js";


const router = Router()

router.get('/', searchProduct)

export default router