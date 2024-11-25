module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        FirstName: {
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        },
        LastName: {
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        },
        Username: {
            type:Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        EncryptedPassword: {
            type:Sequelize.DataTypes.BLOB,
            allowNull:false
        },
        Address: {
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        },
        Email: {
            type:Sequelize.DataTypes.STRING,
            isEmail: true,
            unique: true,
            allowNull: false
        },
        Telephone: {
            type:Sequelize.DataTypes.STRING,
            allowNull: false
        },
		Salt: {
			type: Sequelize.DataTypes.BLOB,
			allowNull: false,
		}
    },{
        timestamps: true
    });
    User.associate = function(models) {
        User.hasMany(models.Membership);
        User.hasMany(models.Cart);
        User.hasMany(models.Order);
        User.belongsTo(models.Role);
    };
    return User
}