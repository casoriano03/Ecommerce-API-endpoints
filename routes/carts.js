var express = require('express');
var router = express.Router();
const jsend = require('jsend')
var db = require("../models");
const CartService = require('../services/CartService')
const cartService = new CartService(db);
const ProductService = require('../services/ProductService')
const productService = new ProductService(db);
const IsDeletedService = require('../services/IsDeletedService')
const isDeletedService = new IsDeletedService(db);
const OrderStatusService = require('../services/OrderStatusService')
const orderStatusService = new OrderStatusService(db);
const OrderService = require('../services/OrderService');
const orderService = new OrderService(db);
const MembershipService = require('../services/MembershipService')
const membershipService = new MembershipService(db);
const MembershipStatusService = require('../services/MembershipStatusService');
const membershipStatusService = new MembershipStatusService(db);
const UserService = require('../services/UserService')
const userService = new UserService(db);
const randomstring = require("random-string-gen");
const isAdmin = require('../middleware/isAdmin');
const isAuth = require('../middleware/isAuth');

router.use(jsend.middleware);

router.get('/', isAuth, async function(req, res, next){
    // #swagger.tags = ['Carts']
  	// #swagger.description = "Get all items in the cart"
	// #swagger.responses[200] = {description: "Successfully retrieved all items in the cart"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['UserId'] = {"in": "path",description: "ID number of a specific user", "required": true, "type": "integer"}
    try{
        const UserId = req.UserId

        const IsDeleted = await isDeletedService.getOne("No")
        const IsDeletedId = IsDeleted.dataValues.id

        const cartItems = await cartService.get(UserId, IsDeletedId)
        res.jsend.success({ "statusCode": 200, "result": cartItems })
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

router.post('/', isAuth, async function(req, res, next){
    // #swagger.tags = ['Carts']
  	// #swagger.description = "Add an item to the cart"
	// #swagger.responses[200] = {description: "Successfully added item to the cart"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/createCart"}}
    // #swagger.parameters['ProductId'] = {"in": "path",description: "ID number of a specific product", "required": true, "type": "integer"}
    try{
        const {Quantity, ProductId} = req.body
        const UserId = req.UserId
    
        const productQtyCheck = await productService.getProductDetails(ProductId)
        const ProductsName = productQtyCheck.dataValues.Name
        const Price = productQtyCheck.dataValues.UnitPrice
        const Total = Quantity*Price

        const IsDeleted = await isDeletedService.getOne("No")
        const IsDeletedId = IsDeleted.dataValues.id

        const cartItemsCheck = await cartService.get(UserId, IsDeletedId)
        const productDuplicate = cartItemsCheck.find((cartProduct) => cartProduct.ProductId === ProductId)        

        if(Quantity > productQtyCheck.dataValues.Quantity){
            res.jsend.fail({ "statusCode": 400, "result": "Order quantity for this product exceeded our stocks. Please reduce quantity"})
        } else if (productDuplicate) {
            res.jsend.fail({ "statusCode": 400, "result": "Product is already added on the cart!"})
        } else {
            const newCartItem = await cartService.create(ProductsName, Quantity, Price, Total, UserId, ProductId, IsDeletedId)
            res.jsend.success({ "statusCode": 200, "result":"Successfully added " + productQtyCheck.Name })
        }       
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

router.post('/checkout/now', isAuth, async function(req, res, next){
    // #swagger.tags = ['Carts']
  	// #swagger.description = "Checkout all items in the cart"
	// #swagger.responses[200] = {description: "Successfully placed order"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['UserId'] = {"in": "path",description: "ID number of a specific user", "required": true, "type": "integer"}
    try{
        const UserId = req.UserId
        const OrderCode = randomstring(8);
        var subTotal = 0;
        var TotalNumberOfItems = 0;
        var orderedProductsArray = [];

        const userDetails = await userService.getOneUserId(UserId)
        const UserFullName = userDetails[0].dataValues.FirstName + " " + userDetails[0].dataValues.LastName

        const IsDeleted = await isDeletedService.getOne("No")
        const IsDeletedId = IsDeleted.dataValues.id

        const cartItems = await cartService.get(UserId, IsDeletedId)
        cartItems.forEach(async cartItem => {
            TotalNumberOfItems += cartItem.dataValues.Quantity;
            subTotal += cartItem.dataValues.Total
            orderedProductsArray.push({
                "ProductId":cartItem.dataValues.ProductId,
                "ProductsName":cartItem.dataValues.ProductsName,
                "Quantity": cartItem.dataValues.Quantity,
                "Price": cartItem.dataValues.Price,
                "Total": cartItem.dataValues.Total
            })
            const isDeleted = await isDeletedService.getOne('Yes')
            const NewIsDeletedId = isDeleted.dataValues.id
            const NewIsDeletedCart = await cartService.softDeleteCart(cartItem.dataValues.id, NewIsDeletedId) 
        });

        const orderStatus = await orderStatusService.getOne("In Progress")
        const OrderStatusId = orderStatus.dataValues.id
        const OrderStatusName = orderStatus.dataValues.OrderStatus

        const OrderedProducts = JSON.stringify(orderedProductsArray)

        const membershipDetails = await membershipService.getOne(UserId)
        const MembershipStatusId = membershipDetails.dataValues.MembershipStatusId

        const membershipStatus = await membershipStatusService.getOneId(MembershipStatusId)
        const membershipDiscount = membershipStatus.dataValues.Discount
        const MembershipTier = membershipStatus.dataValues.MembershipStatus

        const totalDiscount = subTotal*membershipDiscount
        const Total = subTotal-totalDiscount

        const newOrder = await orderService.create(UserFullName, OrderCode, OrderedProducts, Total, TotalNumberOfItems, MembershipTier, OrderStatusName, OrderStatusId, MembershipStatusId, UserId)

        orderedProductsArray.forEach( async orderedProduct => {
            const productDetails = await productService.getProductDetails(orderedProduct.ProductId)
            const newProductQty = productDetails.dataValues.Quantity - orderedProduct.Quantity
            const updatedProductQty = await productService.updateProductQty(orderedProduct.ProductId, newProductQty)
        });

        const currentItemCount = membershipDetails.dataValues.ItemCount
        const MembershipId = membershipDetails.dataValues.id
        const NewItemCount = currentItemCount + TotalNumberOfItems

        if(NewItemCount < 15 && NewItemCount > 0) {
            const membershipStatus = await membershipStatusService.getOne('Bronze')
            const MembershipStatusId = membershipStatus.dataValues.id
            const updatedMembershipStatus = await membershipService.updateMembership(MembershipId, NewItemCount, MembershipStatusId)
        } else if(NewItemCount >= 15 && NewItemCount < 30) {
            const membershipStatus = await membershipStatusService.getOne('Silver')
            const MembershipStatusId = membershipStatus.dataValues.id
            const updatedMembershipStatus = await membershipService.updateMembership(MembershipId, NewItemCount, MembershipStatusId)
        } else if(NewItemCount >= 30) {
            const membershipStatus = await membershipStatusService.getOne('Gold')
            const MembershipStatusId = membershipStatus.dataValues.id
            const updatedMembershipStatus = await membershipService.updateMembership(MembershipId, NewItemCount, MembershipStatusId)
        }

        res.jsend.success({ "statusCode": 200, "result":"Successfully places order" })
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

router.put('/', isAuth, async function(req, res, next){
    // #swagger.tags = ['Carts']
  	// #swagger.description = "Update an item quantity in the cart"
	// #swagger.responses[200] = {description: "Successfully updated cart item"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/editCart"}}
    // #swagger.parameters['CartId'] = {"in": "path",description: "ID number of a specific cart", "required": true, "type": "integer"}
    try{
        const {CartId, NewQuantity} = req.body
        const cartCheck = await cartService.getOne(CartId)
        const productQtyCheck = await productService.getProductDetails(cartCheck.dataValues.ProductId)

        const NewTotal = NewQuantity*productQtyCheck.dataValues.UnitPrice

        if(NewQuantity > productQtyCheck.dataValues.Quantity){
            res.jsend.fail({ "statusCode": 400, "result": "Order quantity for this product exceeded our stocks. Please reduce quantity"})
        } else {
            const updatedCartItem = await cartService.updateCart(CartId, NewQuantity, NewTotal)
            res.jsend.success({ "statusCode": 200, "result": "Successfully updated cart item"})
        }
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

router.delete('/', isAuth, isAdmin, async function(req, res, next){
    // #swagger.tags = ['Carts']
  	// #swagger.description = "Soft delete an item from the cart"
	// #swagger.responses[200] = {description: "Successfully deleted cart item"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['cartId'] = {"in": "path",description: "ID number of a specific cart", "required": true, "type": "integer"}
    try{
        const {cartId} = req.body
        const IsDeleted = await isDeletedService.getOne("Yes")
        const NewIsDeletedId = IsDeleted.dataValues.id
        const softDeletedCart = cartService.softDeleteCart(cartId, NewIsDeletedId)
        res.jsend.success({ "statusCode": 200, "result": "Successfully soft deleted Cart Item! "})
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

module.exports = router;