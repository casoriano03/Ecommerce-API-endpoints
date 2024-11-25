class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
        this.Membership = db.Membership;
        this.Cart = db.Cart;
    }

    async create(FirstName, LastName, Username, EncryptedPassword, Address, Email, Telephone, Salt, RoleId) {
        try{
            const newUser = await this.User.create({
                FirstName: FirstName,
                LastName: LastName,
                Username: Username,
                EncryptedPassword: EncryptedPassword,
                Address: Address,
                Email: Email,
                Telephone: Telephone,
                Salt: Salt,
                RoleId: RoleId
            })
            return newUser;
        } catch(error) {
            console.log("Error creating User:" + error)
        }
    }

    async get() {
        try{
            const users = await this.User.findAll({
            where: {}
            })
            return users;
        } catch(error) {
            console.log("Error getting User:" + error)
        }
    }

    async getOneUserId(UserId) {
        try{
            const users = await this.User.findAll({
            where: {id:UserId}
            })
            return users;
        } catch(error) {
            console.log("Error getting User:" + error)
        }
    }

    async getOneUser(Username) {
        try{
            const user = await this.User.findOne({
            where: {Username:Username}
            })
            return user;
        } catch(error) {
            console.log("Error getting User:" + error)
        }
    }

    async getOneEmail(Email) {
        try{
            const user = await this.User.findOne({
            where: {Email:Email}
            })
            return user;
        } catch(error) {
            console.log("Error getting User:" + error)
        }
    }

    async updateUser(UserId, FirstName, LastName, Username, EncryptedPassword, Address, Email, Telephone, Salt, RoleId){
        try {
            const updatedUser = await this.User.update({
                FirstName: FirstName,
                LastName: LastName,
                Username: Username,
                EncryptedPassword: EncryptedPassword,
                Address: Address,
                Email: Email,
                Telephone: Telephone,
                Salt: Salt,
                RoleId: RoleId
            },{
            where:{id:UserId}
            })
            return updatedUser;
        } catch(error) {
            console.log("Error updating User:" + error)
        }
    }


    async deleteUser(UserId) {
        try{
            const user = await this.User.destroy({
            where: {id: UserId}
            })
            return user;
        } catch(error) {
            console.log("Error deleting User:" + error)
        }
    }

}
module.exports = UserService;