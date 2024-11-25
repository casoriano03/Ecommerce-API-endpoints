class BrandService {
    constructor(db) {
        this.client = db.sequelize;
        this.Brand = db.Brand;
        this.Product = db.Product;
    }

    async create(Brand) {
        try{
            const newBrand = await this.Brand.create({
                Brand: Brand
            })
            return newBrand;
        } catch(error) {
            console.log("Error creating Brand:" + error)
        }
    }

    async get() {
        try{
            const brands = await this.Brand.findAll({
            where: {}
            })
            return brands;
        } catch(error) {
            console.log("Error getting Brands:" + error)
        }
    }

    async getOne(Brand) {
        try{
            const brand = await this.Brand.findOne({
            where: {Brand:Brand}
            })
            return brand;
        } catch(error) {
            console.log("Error getting Categories:" + error)
        }
    }

    async updateBrand(BrandId, NewBrand){
        try {
            const updatedBrand = await this.Brand.update({
                Brand: NewBrand},{
            where:{id:BrandId}
            })
            return updatedBrand;
        } catch(error) {
            console.log("Error updating Brand:" + error)
        }
    }


    async deleteBrand(BrandId) {
        try{
            const brand = await this.Brand.destroy({
            where: {id: BrandId}
            })
            return brand;
        } catch(error) {
            console.log("Error deleting Brand:" + error)
        }
    }

}
module.exports = BrandService;