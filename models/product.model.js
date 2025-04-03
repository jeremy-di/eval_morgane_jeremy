const product = (sequelize, DataTypes) => {
    const Product = sequelize.define('products', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image01: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image02: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image03: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    })

    Product.associate = (models) => {
        Product.hasMany(models.Cart, {
            foreignKey: "productId",
            as: 'productIn Carts'
        })
    }

    return Product
}

export default product