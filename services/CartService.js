class CartService {
    constructor(db) {
        this.client = db.sequelize;
        this.Cart = db.Cart
        this.Order = db.Order;
        this.Product = db.Product;
        this.User = db.User;
    }

    async create(ProductsName, Quantity, Price, Total, UserId, ProductId, IsDeletedId) {
        try{
            const newCart = await this.Cart.create({
                Quantity: Quantity,
                Total: Total,
                Price: Price,
                UserId: UserId,
                ProductId: ProductId,
                ProductsName: ProductsName,
                IsDeletedId: IsDeletedId
            })
            return newCart;
        } catch(error) {
            console.log("Error creating Brand:" + error)
        }
    }

    async get(UserId, IsDeletedId) {
        try{
            const carts = await this.Cart.findAll({
            where: {UserId:UserId,IsDeletedId:IsDeletedId}
            })
            return carts;
        } catch(error) {
            console.log("Error getting Brands:" + error)
        }
    }

    async getOne(CartId) {
        try{
            const cart = await this.Cart.findOne({
            where: {id:CartId}
            })
            return cart;
        } catch(error) {
            console.log("Error getting Brands:" + error)
        }
    }


    async updateCart(CartId, NewQuantity, NewTotal ){
        try {
            const updatedCart = await this.Cart.update({
                Quantity: NewQuantity,
                Total: NewTotal},{
            where:{id:CartId}
            })
            return updatedCart;
        } catch(error) {
            console.log("Error updating Brand:" + error)
        }
    }

    async softDeleteCart(cartId, NewIsDeletedId){
        try {
            const softDeletedCart = await this.Cart.update({
            IsDeletedId: NewIsDeletedId},{
            where:{id:cartId}
            })
            return softDeletedCart;
        } catch(error) {
            console.log("Error updating cartItem:" + error)
        }
    }


    async deleteCart(CartId) {
        try{
            const cart = await this.Cart.destroy({
            where: {id: CartId}
            })
            return cart;
        } catch(error) {
            console.log("Error deleting Brand:" + error)
        }
    }

}
module.exports = CartService;