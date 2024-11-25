module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define('Cart', {
        ProductsName:{
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        },
        Quantity:{
            type:Sequelize.DataTypes.INTEGER,
            allowNull: false
        },
        Price:{
            type:Sequelize.DataTypes.INTEGER,
            allowNull: false
        },
        Total:{
            type:Sequelize.DataTypes.INTEGER,
            allowNull: false
        }
    },{
        timestamps: true
    });
    Cart.associate = function(models) {
        Cart.belongsTo(models.User);
        Cart.belongsTo(models.Product);
        Cart.belongsTo(models.IsDeleted);
    };
    return Cart
}