var express = require('express');
var router = express.Router();
const jsend = require('jsend')
var db = require("../models");
const OrderService = require('../services/OrderService');
const orderService = new OrderService(db);
const UserService = require('../services/UserService');
const userService = new UserService(db);
const OrderStatusService = require('../services/OrderStatusService');
const orderStatusService = new OrderStatusService(db);
const isAuth = require('../middleware/isAuth');
const isAuth2 = require('../middleware/isAuth2');
const isAdmin = require('../middleware/isAdmin');


router.use(jsend.middleware);

router.get('/', isAuth2, async function(req, res, next){
    // #swagger.tags = ['Orders']
  	// #swagger.description = "Get all orders"
	// #swagger.responses[200] = {description: "Successfully retrieved all orders"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Bearer token to authorize the request",required: true,type: "string"}
    try{
        const UserId = req.UserId
        const AdminUser = await userService.getOneUser('Admin')
        const AdminUserId = AdminUser.dataValues.id
        if(AdminUserId === UserId) {
            const allOrders = await orderService.getAdmin()
            res.jsend.success({ "statusCode": 200, "result": allOrders})
        } else {
            const userOrders = await orderService.getUser(UserId)
            res.jsend.success({ "statusCode": 200, "result": userOrders })
        }  
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

router.put('/', isAuth2, isAdmin, async function(req, res, next){
    // #swagger.tags = ['Orders']
  	// #swagger.description = "Edit an existing order status"
	// #swagger.responses[200] = {description: "Successfully edited the orders status"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/editOrder"}}
    // #swagger.parameters['OrderId'] = {"in": "path",description: "ID number of a specific order", "required": true, "type": "integer"}
    try{
        const {OrderId, NewOrderStatusId} = req.body

        const newOrderStatusDetails = await orderStatusService.getOneId(NewOrderStatusId)
        const newOrderStatus = newOrderStatusDetails[0].dataValues.OrderStatus

        const updatedOrderStatus = await orderService.updateOrder(OrderId, newOrderStatus, NewOrderStatusId)
        res.jsend.success({ "statusCode": 200, "result": "Successfully updated order status" })
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

module.exports = router;