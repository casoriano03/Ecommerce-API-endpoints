class IsDeletedService {
    constructor(db) {
        this.client = db.sequelize;
        this.IsDeleted = db.IsDeleted;
        this.Product = db.Product;
    }

    async create(IsDeleted) {
        try{
            const isDeleted = await this.IsDeleted.create({
                IsDeleted: IsDeleted
            })
            return isDeleted;
        } catch(error) {
            console.log("Error creating IsDeleted:" + error)
        }
    }

    async get() {
        try{
            const isdeleted = await this.IsDeleted.findAll({
            where: {}
            })
            return isdeleted;
        } catch(error) {
            console.log("Error getting IsDeleted:" + error)
        }
    }

    async getOne(IsDeleted) {
        try{
            const isDeleted = await this.IsDeleted.findOne({
            where: {IsDeleted:IsDeleted}
            })
            return isDeleted;
        } catch(error) {
            console.log("Error getting Categories:" + error)
        }
    }

    async updateIsDeleted(IsDeletedId, NewIsDeleted){
        try {
            const updatedIsDeleted = await this.IsDeleted.update({
                IsDeleted: NewIsDeleted},{
            where:{id:IsDeletedId}
            })
            return updatedIsDeleted;
        } catch(error) {
            console.log("Error updating product:" + error)
        }
    }


    async deleteIsDeleted(IsDeletedId) {
        try{
            const isdeleted = await this.IsDeleted.destroy({
            where: {id: IsDeletedId}
            })
            return isdeleted;
        } catch(error) {
            console.log("Error deleting IsDeleted:" + error)
        }
    }

}
module.exports = IsDeletedService;