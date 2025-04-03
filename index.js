import express from 'express'
import db from './db/db.js'
import userRoute from './routes/user.route.js'
import productRoute from './routes/product.route.js'
import cartRoute from './routes/cart.route.js'
import searchRoute from './routes/search.route.js'
import categoriesRoute from './routes/categories.route.js'
import cors from 'cors'
import './middlewares/auth.js'

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
    
app.use('/', userRoute)
app.use('/product', productRoute)
app.use('/cart', cartRoute)
app.use('/search', searchRoute)
app.use('/categories', categoriesRoute)
app.listen(process.env.API_PORT, () => console.log(`Connexion établie sur le port ${process.env.API_PORT}`))

