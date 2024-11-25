class RoleService {
    constructor(db) {
        this.client = db.sequelize;
        this.Role = db.Role;
        this.User = db.User;
    }

    async create(Role) {
        try{
            const newRole = await this.Role.create({
                Role: Role
            })
            return newRole;
        } catch(error) {
            console.log("Error creating Category:" + error)
        }
    }

    async get() {
        try{
            const role = await this.Role.findAll({
            where: {}
            })
            return role;
        } catch(error) {
            console.log("Error getting Categories:" + error)
        }
    }

    async getOne(Role) {
        try{
            const role = await this.Role.findOne({
            where: {Role:Role}
            })
            return role;
        } catch(error) {
            console.log("Error getting Categories:" + error)
        }
    }

    async updateRole(RoleId, NewRole){
        try {
            const updatedRole = await this.Role.update({
                Role: NewRole},{
            where:{id:RoleId}
            })
            return updatedRole;
        } catch(error) {
            console.log("Error updating Category:" + error)
        }
    }


    async deleteRole(RoleId) {
        try{
            const roleId = await this.Role.destroy({
            where: {id: RoleId}
            })
            return roleId;
        } catch(error) {
            console.log("Error deleting Category:" + error)
        }
    }

}
module.exports = RoleService;