module.exports = (sequelize, Sequelize) => {
    const Brand = sequelize.define('Brand', {
        Brand:{
            type:Sequelize.DataTypes.STRING,
            allowNull:false
        }
    },{
        timestamps: true
    });
    Brand.associate = function(models) {
        Brand.hasOne(models.Product);
    };
    return Brand
}