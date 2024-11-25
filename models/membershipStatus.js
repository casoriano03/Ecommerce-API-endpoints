module.exports = (sequelize, Sequelize) => {
    const MembershipStatus = sequelize.define('MembershipStatus', {
        MembershipStatus:{
            type:Sequelize.DataTypes.STRING,
            allowNull:false
        },
        Discount:{
            type:Sequelize.DataTypes.DECIMAL(10, 2),
            allowNull:false
        }
    },{
        timestamps: true
    });
    MembershipStatus.associate = function(models) {
        MembershipStatus.hasOne(models.Membership);
    };
    return MembershipStatus
}