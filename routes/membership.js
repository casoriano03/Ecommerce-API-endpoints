const express = require('express');
const router = express.Router();
var db = require("../models");
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const axios = require('axios')
const jsend = require('jsend');
const UserService = require('../services/UserService')
const userService = new UserService(db);
const OrderService = require('../services/OrderService');
const orderService = new OrderService(db);
const MembershipService = require('../services/MembershipService')
const membershipService = new MembershipService(db);
const MembershipStatusService = require('../services/MembershipStatusService')
const membershipStatusService = new MembershipStatusService(db);
const isAuth = require('../middleware/isAuth');


router.use(jsend.middleware);

router.get('/', isAuth, async function(req, res, next){
    // #swagger.tags = ['Membership']
  	// #swagger.description = "Get user and membership information as well as previous orders"
	// #swagger.responses[200] = {description: "Successfully retrieved user information"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['userId'] = {"in": "path",description: "ID number of a specific user", "required": true, "type": "integer"}
    try{
        const userId = req.UserId
        const userDetails = await userService.getOneUserId(userId)

        const orderDetails = await orderService.getUser(userId)

        const membershipStatus = await membershipService.getOne(userId)

        const membershipStatusDetails = await membershipStatusService.getOneId(membershipStatus.dataValues.MembershipStatusId)
      
        
        res.render('membership', {userDetails:userDetails, orderDetails:orderDetails, membershipStatusDetails:membershipStatusDetails})
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! membership/get " + error })
    }
})




module.exports = router;