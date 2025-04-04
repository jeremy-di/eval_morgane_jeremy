import { Router } from "express";
import { generateCsrfTokken } from "../middlewares/csrf.js";


const router = Router()

router.get('/', generateCsrfTokken)

export default router