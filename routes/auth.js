var express = require('express');
var router = express.Router();
const jsend = require('jsend')
var db = require("../models/index");
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const UserService = require('../services/UserService')
const userService = new UserService(db);
const RoleService = require('../services/RoleService')
const roleService = new RoleService(db);
const MembershipStatusService = require('../services/MembershipStatusService')
const membershipStatusService = new MembershipStatusService(db);
const MembershipService = require('../services/MembershipService')
const membershipService = new MembershipService(db);
const validator = require("email-validator");

router.use(jsend.middleware);

router.get('/login', async function(req, res, next){
    // #swagger.tags = ['Auth']
  	// #swagger.description = "Sign in Page"
	//  #swagger.responses[200] = {description: "Login page retrieved successfully"}
	//  #swagger.responses[400] = {description: "Fail! Something went wrong"}
    try{
        res.render('login')
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error.stack })
    } 
})

router.get('/register', async function(req, res, next){
     // #swagger.tags = ['Auth']
  	// #swagger.description = "Sign up Page"
	//  #swagger.responses[200] = {description: "Sign up page retrieved successfully"}
	//  #swagger.responses[400] = {description: "Fail! Something went wrong"}
    try{
        res.render('register')
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error.stack })
    }
})

router.post('/login', async function(req, res, next){
    // #swagger.tags = ['Auth']
  	// #swagger.description = "Login with registered Email or Username and Password"
	//  #swagger.responses[200] = {description: "You are logged in"}
	//  #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/loginInfo"}}
    try{
        const { EmailorUsername, Password } = req.body;
        var userDetails 
        var encryptedPassword 
        var Salt

        const UserDetailsEmail = await userService.getOneEmail(EmailorUsername)
        const UserDetailsUser = await userService.getOneUser(EmailorUsername)

        if(UserDetailsEmail) {
            const encPassword = UserDetailsEmail.dataValues.EncryptedPassword
            const salt = UserDetailsEmail.dataValues.Salt
            userDetails = UserDetailsEmail
            encryptedPassword = encPassword 
            Salt = salt
        } else if (UserDetailsUser) {
            const encPassword = UserDetailsUser.dataValues.EncryptedPassword
            const salt = UserDetailsUser.dataValues.Salt
            userDetails = UserDetailsUser
            encryptedPassword = encPassword 
            Salt = salt
        } else {
            console.log({"statusCode": 400, "result": "Please provide a valid Username/Email and Password"});
        }
       
        crypto.pbkdf2(Password, Salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) { return cb(err); }
            if (!crypto.timingSafeEqual(encryptedPassword, hashedPassword)) {
                return console.log({"statusCode": 400, "result": "Incorrect Username or Password"})
            }
            var token;
          try{
            token = jwt.sign(
                {id:userDetails.dataValues.id, Username:userDetails.dataValues.Username},
                process.env.TOKEN_SECRET,
                {expiresIn: "2h"}
            )
            res.cookie('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
          } catch (error) {
            res.jsend.error("Something went wrong with creating JWT Token" + error.stack)
          }
          res.jsend.success({"statusCode": 200, "result": "You are logged in","id":userDetails.dataValues.id, "Name":userDetails.dataValues.FirstName, "Email": userDetails.dataValues.Email, "token":token});
        })
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error.stack })
    }
})

router.post('/register', async function(req, res, next){
    // #swagger.tags = ['Auth']
  	// #swagger.description = "Tp register enter FirstName, LastName, Username, Password, Address, Email and Telephone"
	//  #swagger.responses[200] = {description: "Successfully created account"}
	//  #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/signupInfo"}}
    try{
        const {FirstName, LastName, Username, Password, Address, Email, Telephone} = req.body;
        console.log(FirstName, LastName, Username, Password, Address, Email, Telephone)

        const emailValidation = validator.validate(Email);
        if(!emailValidation) {
            res.status(400).json({"statusCode": 400, "result": "auth/register/email Please enter a valid email address"})
        }
    
        const userRole = await roleService.getOne('RegisteredUser')
        const RoleId = userRole.dataValues.id
         
        const Salt = crypto.randomBytes(16);
        crypto.pbkdf2(Password, Salt, 310000, 32, 'sha256', async function(error, EncryptedPassword){
            if(error) {
                res.status(400).json({ "statusCode": 400, "result": "auth/register/EncryptedPassword Something went wrong! " + error.stack })
            } else {
                const newUser = await userService.create(FirstName, LastName, Username, EncryptedPassword, Address, Email, Telephone, Salt, RoleId)

                try{
                    const userDetails = await userService.getOneUser(Username)
                    const userId = userDetails.dataValues.id
                    const membershipStatus = await membershipStatusService.getOne('Bronze')
                    const membershipStatusId = membershipStatus.dataValues.id
                    const userMembershipStatus = membershipStatus.dataValues.MembershipStatus
                    const userMembership = await membershipService.create(0, userId, membershipStatusId)
                    res.jsend.success({ "statusCode": 200, "result": "Successfully created account for " + FirstName + " " + LastName + " with " + userMembershipStatus + " membership status"})
                } catch(error) {
                    res.status(400).json({ "statusCode": 400, "result": "auth/register/userMembership Something went wrong! " + error.stack})
                }                             
            }
        })
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error.stack })
    }
})


module.exports = router;