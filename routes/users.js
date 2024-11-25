var express = require('express');
var router = express.Router();
var db = require("../models");
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const axios = require('axios')
const jsend = require('jsend')
const UserService = require('../services/UserService');
const userService = new UserService(db);
const isAuth2 = require('../middleware/isAuth2');
const isAdmin = require('../middleware/isAdmin');

router.use(jsend.middleware);

/* GET users listing. */
router.get('/', isAuth2, isAdmin, async function(req, res, next) {
   // #swagger.tags = ['Users']
  // #swagger.description = "Get all users"
	// #swagger.responses[200] = {description: "Successfully retrieved all users"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
  // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
  try{
    const users = await userService.get()
    res.jsend.success({ "statusCode": 200, "result": users })
  } catch(error) {
    res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! users/get " + error })
  }
});

module.exports = router;
