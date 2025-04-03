import { Sequelize } from "sequelize";
import user from "../models/user.model.js";
import product from "../models/product.model.js";
import cart from "../models/cart.model.js"

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.ROOT_SQL,
    process.env.SQL_PASSWORD,
    {
        dialect: 'mysql',
        host: 'localhost',
        port: process.env.SQL_PORT
    }
)

sequelize.User = user(sequelize, Sequelize)
sequelize.Product = product(sequelize, Sequelize)
sequelize.Cart = cart(sequelize, Sequelize)

Object.keys(sequelize).forEach((modelName) => {
    if ( sequelize[modelName].associate ) {
        sequelize[modelName].associate(sequelize)
    }
})

export default sequelize