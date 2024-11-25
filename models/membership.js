module.exports = (sequelize, Sequelize) => {
    const Membership = sequelize.define('Membership', {
        ItemCount:{
            type:Sequelize.DataTypes.INTEGER,
            allowNull: false
        },
    },{
        timestamps: true
    });
    Membership.associate = function(models) {
        Membership.belongsTo(models.User);
        Membership.belongsTo(models.Order, {foreignKey:{allowNull: true}});
        Membership.belongsTo(models.MembershipStatus);
    };
    return Membership
}