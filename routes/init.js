var express = require('express');
var router = express.Router();
const jsend = require('jsend')
const axios = require('axios');
var crypto = require('crypto');
var db = require("../models");
const BrandService = require('../services/BrandService')
const brandService = new BrandService(db);
const RoleService = require('../services/RoleService')
const roleService = new RoleService(db);
const IsDeletedService = require('../services/IsDeletedService')
const isDeletedService = new IsDeletedService(db);
const CategoryService = require('../services/CategoryService')
const categoryService = new CategoryService(db);
const OrderStatusService = require('../services/OrderStatusService')
const orderStatusService = new OrderStatusService(db);
const MembershipStatusService = require('../services/MembershipStatusService')
const membershipStatusService = new MembershipStatusService(db);
const UserService = require('../services/UserService')
const userService = new UserService(db);
const ProductService = require('../services/ProductService')
const productService = new ProductService(db);
const MembershipService = require('../services/MembershipService')
const membershipService = new MembershipService(db);
const initRoleData = require('../data/initRoleData.json')
const initBrandData = require('../data/initBrandsData.json')
const initIsDeletedData = require('../data/initIsDeletedData.json')
const initCategoryData = require('../data/initCategoryData.json')
const initOrderStatusData = require('../data/initOrderStatusData.json')
const initMembershipStatusData = require('../data/initMembershipStatusData.json')
const initAdminUserData = require('../data/initAdminUserData.json');


router.use(jsend.middleware);

router.get('/', async function(req, res, next){
    // #swagger.tags = ['Utilities']
  	// #swagger.description = "Get init page"
	// #swagger.responses[200] = {description: "Successfully retrieved init page"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}  
    try{
        res.render('init')
    } catch(error) {
        res.status(400).json({ "statusCode": 400, "result": "Something went wrong! init/get " + error })
    }   
})

router.post('/', async function (req, res, next) {
    // #swagger.tags = ['Utilities']
  	// #swagger.description = "Populate data in the database"
	// #swagger.responses[200] = {description: "Successfully populated database"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}  
    try{
        const initRole = await roleService.get()
        if(initRole.length === 0) {
            await initRoleData.forEach(roleData => {
            roleService.create(roleData.Role)
        })
        }
    } catch(error) {
        res.status(400).json({ "statusCode": 400, "result": "Something went wrong! init/post/initRole " + error })
    }

    try{
        const initBrands = await brandService.get()
        if(initBrands.length === 0) {
            await initBrandData.forEach(brandData =>{
            brandService.create(brandData.Brand)
        })
        }       
    } catch(error) {
        res.status(400).json({ "statusCode": 400, "result": "Something went wrong! init/post/initBrands " + error })
    }

    try{
        const initIsDeleted = await isDeletedService.get()
        if(initIsDeleted.length === 0) {
            await initIsDeletedData.forEach(isDeletedData =>{
            isDeletedService.create(isDeletedData.IsDeleted)
        })
        }
    } catch(error) {
        res.status(400).json({ "statusCode": 400, "result": "Something went wrong! init/post/initIsDeleted " + error })
    }

    try{
        const initCategory = await categoryService.get()
        if(initCategory.length === 0) {
            await initCategoryData.forEach(categoryData =>{
            categoryService.create(categoryData.Category)
        })
        } 
    } catch(error) {
        res.status(400).json({ "statusCode": 400, "result": "Something went wrong! init/post/initCategory " + error })
    }

    try{
        const initOrderStatus = await orderStatusService.get()
        if(initOrderStatus.length === 0) {
            await initOrderStatusData.forEach(orderStatusData =>{
            orderStatusService.create(orderStatusData.OrderStatus)
        })
        }
    } catch(error) {
        res.status(400).json({ "statusCode": 400, "result": "Something went wrong! init/post/initOrderStatus " + error })
    }

    try{
        const initMembershipStatus = await membershipStatusService.get()
        if(initMembershipStatus.length === 0) {
            await initMembershipStatusData.forEach(membershipStatusData =>{
            membershipStatusService.create(membershipStatusData.MembershipStatus, membershipStatusData.Discount)
        })
        }
    } catch(error) {
        res.status(400).json({ "statusCode": 400, "result": "Something went wrong! init/post/initMembershipStatus " + error })
    }

    try{
        const Salt = crypto.randomBytes(16);
        crypto.pbkdf2(initAdminUserData.Password, Salt, 310000, 32, 'sha256', async function(err, EncryptedPassword) {
            if (err){ 
                res.status(400).json({ "statusCode": 400, "result": "Something went wrong! " + error }); 
            } else {
                const adminRole = await roleService.getOne("Admin")
                const AdminRoleId = adminRole.dataValues.id
                await userService.create(initAdminUserData.FirstName, initAdminUserData.LastName, initAdminUserData.Username, EncryptedPassword, initAdminUserData.Address, initAdminUserData.Email, initAdminUserData.Telephone, Salt, AdminRoleId)
                const initMembership = await membershipService.get()
                if(initMembership.length === 0) {
                    const adminUser = await userService.getOneUser(initAdminUserData.Username)
                    const adminUserId = adminUser.dataValues.id
                    const membershipStatus = await membershipStatusService.getOne('Bronze')
                    const membershipStatusId = membershipStatus.dataValues.id
                    const adminMembership = await membershipService.create(0, adminUserId, membershipStatusId)
                }
            }
        })
    } catch(error) {
        res.status(400).json({ "statusCode": 400, "result": "Something went wrong! init/post/adminMembership " + error })
    }

    try{
        const initProducts = await productService.getCheck()
        if(initProducts.length === 0) {
            const response = await axios.get('http://backend.restapi.co.za/items/products', {
            headers: {'Content-Type': 'application/json'}
            })
            const products = response.data.data
            for (const productData of products) {
            const productBrand = await brandService.getOne(productData.brand);
            const productBrandId = productBrand.dataValues.id
            const productCategory = await categoryService.getOne(productData.category);
            const productCategoryId = productCategory.dataValues.id
            const productDeleted = await isDeletedService.getOne("No")
            const productDeletedId = productDeleted.dataValues.id
            productService.create(productData.name, productData.description, productData.price, productData.imgurl, productData.quantity, productData.brand, productData.category, productBrandId, productCategoryId, productDeletedId);
            }
        }
    } catch(error) {
        res.status(400).json({ "statusCode": 400, "result": "Something went wrong! init/post/initProducts " + error })
    }
     res.jsend.success({ "statusCode": 200, "result": "Successfully added products to database!"});
})

module.exports = router;