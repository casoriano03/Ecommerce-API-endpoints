module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('Product', {
        Name: {
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        },
        Description: {
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        },
        UnitPrice: {
            type:Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        ImageURL: {
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        },
        Quantity: {
            type:Sequelize.DataTypes.INTEGER,
            allowNull: false
        },
        BrandName: {
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        },
        CategoryName:{
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        },

    },{
        timestamps: true
    });
    Product.associate = function(models) {
        Product.hasOne(models.Cart);
        Product.belongsTo(models.IsDeleted);
        Product.belongsTo(models.Brand);
        Product.belongsTo(models.Category);
    };
    return Product
}