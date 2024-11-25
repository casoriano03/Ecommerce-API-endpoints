module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('Order', {
        UserFullName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        OrderedCode: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        OrderedProducts: {
            type: Sequelize.JSON,
            allowNull: false
        },
        TotalAmount: {
            type:Sequelize.DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        TotalNumberOfItems: {
            type:Sequelize.DataTypes.INTEGER,
            allowNull: false
        },
        MembershipTier: {
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        },
        OrderStatusName: {
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        }
    },{
        timestamps: true
    });
    Order.associate = function(models) {
      
        Order.belongsTo(models.OrderStatus);
        Order.belongsTo(models.MembershipStatus);
        Order.belongsTo(models.User);
    };
    return Order
}