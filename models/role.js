module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
        Role: {
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        }
    },{
        timestamps: true
    });
    Role.associate = function(models) {
        Role.hasOne(models.User);
    };
    return Role
}