import express from 'express'
import db from './db/db.js'
import userRoute from './routes/user.route.js'
import productRoute from './routes/product.route.js'
import cartRoute from './routes/cart.route.js'
import searchRoute from './routes/search.route.js'
import categoriesRoute from './routes/categories.route.js'
import csrfRoute from './routes/csrf.route.js'
import cors from 'cors'
import './middlewares/auth.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express();

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
}));

app.use(express.json())

db.sync()
    .then(console.log("Connexion à la base de données établie"))
    .catch((error) => console.error(error)
    )

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
    
app.use('/', userRoute)
app.use('/product', productRoute)
app.use('/cart', cartRoute)
app.use('/search', searchRoute)
app.use('/categories', categoriesRoute)
app.use('/csrf-token',cartRoute)
app.use('/images', express.static(path.join(__dirname, 'images')))
app.listen(process.env.API_PORT, () => console.log(`Connexion établie sur le port ${process.env.API_PORT}`))

