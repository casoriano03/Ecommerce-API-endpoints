class ProductService {
    constructor(db) {
        this.client = db.sequelize;
        this.Product = db.Product;
        this.Cart = db.Cart;
        this.IsDeleted = db.IsDeleted;
        this.Brand = db.Brand;
        this.Category = db.Category;
    }

    async create(Name, Description, UnitPrice, ImageURL, Quantity, BrandName, CategoryName, BrandId, CategoryId, IsDeletedId) {
        try {
            const newProduct = await this.Product.create({
                Name: Name,
                Description: Description,
                UnitPrice:UnitPrice,
                ImageURL:ImageURL,
                Quantity:Quantity,
                BrandName:BrandName,
                CategoryName:CategoryName,
                BrandId: BrandId,
                CategoryId: CategoryId,
                IsDeletedId: IsDeletedId
            })
            return newProduct;
        } catch(error) {
            console.log("Error updating product:" + error)
        }
    }

    async getCheck() {
        try {
            const products = await this.Product.findAll({
            where: {}
            })
            return products;
        } catch(error) {
            console.log("Error getting products:" + error)
        }
    }


    async get(IsDeletedId) {
        try {
            const products = await this.Product.findAll({
            where: {IsDeletedId:IsDeletedId}
            })
            return products;
        } catch(error) {
            console.log("Error getting products:" + error)
        }
    }

    async getProductDetails(productId) {
        try {
            const product =  await this.Product.findOne({
            where: {
                id: productId
            }
            })
            return product;
        } catch(error) {
            console.log("Error getting product details:" + error)
        }
        return product
    }

    async updateProductQty(productId, NewQuantity){
        try {
            const updatedProduct = await this.Product.update({
            Quantity:NewQuantity},{
            where:{id:productId}
            })
            return updatedProduct;
        } catch(error) {
            console.log("Error updating product:" + error)
        }
    }

    async updateProduct(productId, NewName, NewDescription, NewUnitPrice, NewImageURL, NewQuantity, NewBrandName, NewCategoryName, NewBrandId, NewCategoryId, NewIsDeletedId){
        try {
            const updatedProduct = await this.Product.update({
            Name: NewName,
            Description: NewDescription,
            UnitPrice:NewUnitPrice,
            ImageURL:NewImageURL,
            Quantity:NewQuantity,
            BrandName:NewBrandName,
            CategoryName:NewCategoryName,
            BrandId: NewBrandId,
            CategoryId: NewCategoryId},{
            where:{id:productId}
            })
            return updatedProduct;
        } catch(error) {
            console.log("Error updating product:" + error)
        }
    }

    async softDeleteProduct(productId, NewIsDeletedId){
        try {
            const softDeletedProduct = await this.Product.update({
            IsDeletedId: NewIsDeletedId},{
            where:{id:productId}
            })
            return softDeletedProduct;
        } catch(error) {
            console.log("Error updating product:" + error)
        }
    }


    async permDeleteProduct(productId) {
        try {
            return this.Hotel.destroy({
            where: {id: productId}
        })
        } catch(error) {
            console.log("Error deleting product" + error)
        }
    }

}
module.exports = ProductService;