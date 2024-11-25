class OrderStatusService {
    constructor(db) {
        this.client = db.sequelize;
        this.OrderStatus = db.OrderStatus;
        this.Order = db.Order;
    }

    async create(OrderStatus) {
        try{
            const newOrderStatus = await this.OrderStatus.create({
                OrderStatus: OrderStatus
            })
            return newOrderStatus;
        } catch(error) {
            console.log("Error creating Category:" + error)
        }
    }

    async get() {
        try{
            const orderStatus = await this.OrderStatus.findAll({
            where: {}
            })
            return orderStatus;
        } catch(error) {
            console.log("Error getting Categories:" + error)
        }
    }

    async getOneId(OrderStatusId) {
        try{
            const orderStatus = await this.OrderStatus.findAll({
            where: {id:OrderStatusId}
            })
            return orderStatus;
        } catch(error) {
            console.log("Error getting Categories:" + error)
        }
    }

    async getOne(OrderStatus) {
        try{
            const orderStatus = await this.OrderStatus.findOne({
            where: {OrderStatus:OrderStatus}
            })
            return orderStatus;
        } catch(error) {
            console.log("Error getting Categories:" + error)
        }
    }

    async updateOrderStatus(OrderStatusId, NewOrderStatus){
        try {
            const updatedOrderStatus = await this.OrderStatus.update({
                OrderStatus: NewOrderStatus},{
            where:{id:OrderStatusId}
            })
            return updatedOrderStatus;
        } catch(error) {
            console.log("Error updating Category:" + error)
        }
    }


    async deleteOrderStatus(OrderStatusId) {
        try{
            const orderStatusId = await this.OrderStatus.destroy({
            where: {id: OrderStatusId}
            })
            return orderStatusId;
        } catch(error) {
            console.log("Error deleting Category:" + error)
        }
    }

}
module.exports = OrderStatusService;