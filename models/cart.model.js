import User from "../models/user.model.js"

const cart = (sequelize, DataTypes) => {
    const Cart = sequelize.define('carts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    })

    Cart.associate = (models) => {
        Cart.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product'
        })
    }

    return Cart
}

export default cart