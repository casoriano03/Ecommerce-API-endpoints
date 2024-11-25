module.exports = (sequelize, Sequelize) => {
    const OrderStatus = sequelize.define('OrderStatus', {
        OrderStatus: {
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        }
    },{
        timestamps: true
    });
    OrderStatus.associate = function(models) {
        OrderStatus.hasOne(models.Order);
    };
    return OrderStatus
}