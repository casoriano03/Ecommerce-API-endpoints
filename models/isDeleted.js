module.exports = (sequelize, Sequelize) => {
    const IsDeleted = sequelize.define('IsDeleted', {
        IsDeleted:{
            type:Sequelize.DataTypes.STRING,
            allowNull:false
        }
    },{
        timestamps: true
    });
    IsDeleted.associate = function(models) {
        IsDeleted.hasOne(models.Product);
    };
    return IsDeleted
}