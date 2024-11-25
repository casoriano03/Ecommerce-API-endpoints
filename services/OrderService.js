class OrderService {
    constructor(db) {
        this.client = db.sequelize;
        this.Order = db.Order
        this.OrderStatus = db.OrderStatus;
        this.Cart = db.Cart;
    }

    async create(UserFullName, OrderedCode, OrderedProducts, TotalAmount, TotalNumberOfItems, MembershipTier, OrderStatusName, OrderStatusId, MembershipStatusId, UserId) {
        try{
            const newOrder = await this.Order.create({
                UserFullName:UserFullName,
                OrderedCode: OrderedCode,
                OrderedProducts: OrderedProducts,
                TotalAmount: TotalAmount,
                TotalNumberOfItems: TotalNumberOfItems,
                MembershipTier: MembershipTier,
                OrderStatusName:OrderStatusName,
                OrderStatusId: OrderStatusId,
                MembershipStatusId: MembershipStatusId,
                UserId: UserId
            })
            return newOrder;
        } catch(error) {
            console.log("Error creating Category:" + error)
        }
    }

    async getAdmin() {
        try{
            const order = await this.Order.findAll({
            where: {}
            })
            return order;
        } catch(error) {
            console.log("Error getting Categories:" + error)
        }
    }


    async getUser(UserId) {
        try{
            const order = await this.Order.findAll({
            where: {UserId:UserId}
            })
            return order;
        } catch(error) {
            console.log("Error getting Categories:" + error)
        }
    }

    async updateOrder(OrderId, newOrderStatus, NewOrderStatusId){
        try {
            const updatedOrder = await this.Order.update({
                OrderStatusName:newOrderStatus,
                OrderStatusId: NewOrderStatusId},{
            where:{id:OrderId}
            })
            return updatedOrder;
        } catch(error) {
            console.log("Error updating Category:" + error)
        }
    }


    async deleteOrder(OrderId) {
        try{
            const orderId = await this.Order.destroy({
            where: {id: OrderId}
            })
            return orderId;
        } catch(error) {
            console.log("Error deleting Category:" + error)
        }
    }

}
module.exports = OrderService;