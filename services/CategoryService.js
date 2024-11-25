class CategoryService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
        this.Product = db.Product;
    }

    async create(Category) {
        try{
            const newCategory = await this.Category.create({
                Category: Category
            })
            return newCategory;
        } catch(error) {
            console.log("Error creating Category:" + error)
        }
    }

    async get() {
        try{
            const categories = await this.Category.findAll({
            where: {}
            })
            return categories;
        } catch(error) {
            console.log("Error getting Categories:" + error)
        }
    }

    async getOne(Category) {
        try{
            const category = await this.Category.findOne({
            where: {Category:Category}
            })
            return category;
        } catch(error) {
            console.log("Error getting Categories:" + error)
        }
    }

    async updateCategory(CategoryId, NewCategory){
        try {
            const updatedCategory = await this.Category.update({
                Category: NewCategory},{
            where:{id:CategoryId}
            })
            return updatedCategory;
        } catch(error) {
            console.log("Error updating Category:" + error)
        }
    }


    async deleteCategory(CategoryId) {
        try{
            const category = await this.Category.destroy({
            where: {id: CategoryId}
            })
            return category;
        } catch(error) {
            console.log("Error deleting Category:" + error)
        }
    }

}
module.exports = CategoryService;