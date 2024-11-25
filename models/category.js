module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define('Category', {
        Category:{
            type:Sequelize.DataTypes.STRING,
            allowNull:false
        }
    },{
        timestamps: true
    });
    Category.associate = function(models) {
        Category.hasOne(models.Product);
    };
    return Category
}