const express = require('express');
const router = express.Router();
var db = require("../models");
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const axios = require('axios')
const jsend = require('jsend')
const ProductService = require('../services/ProductService')
const productService = new ProductService(db);
const BrandService = require('../services/BrandService')
const brandService = new BrandService(db);
const CategoryService = require('../services/CategoryService');
const categoryService = new CategoryService(db);
const OrderStatusService = require('../services/OrderStatusService');
const orderStatusService = new OrderStatusService(db);
const OrderService = require('../services/OrderService');
const orderService = new OrderService(db);
const UserService = require('../services/UserService')
const userService = new UserService(db);
const isAdmin = require('../middleware/isAdmin');
const isAuth = require('../middleware/isAuth');


router.use(jsend.middleware);

router.get('/',isAuth, isAdmin, async function(req, res, next){
    // #swagger.tags = ['Admin']
  	// #swagger.description = "Get admin dashboard data"
	// #swagger.responses[200] = {description: "Successfully retrieved admin dashboard data"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    try{
        var salesTotal = 0;
        var itemsTotal = 0;
        var deliveryTotal = 0;
        var lowProduct = 0;

        const ordersDetails = await orderService.getAdmin()
        const ordersTotal = ordersDetails.length;

        const deliveryStatusDetails = await orderStatusService.getOne("In Progress")
        const deliveryStatusId = deliveryStatusDetails.dataValues.id
        
        ordersDetails.forEach(order => {
            salesTotal += parseFloat(order.dataValues.TotalAmount)
            itemsTotal += order.dataValues.TotalNumberOfItems
            if(order.dataValues.OrderStatusId === deliveryStatusId) {
                deliveryTotal += 1
            }       
        });
        const usersDetails = await userService.get()
        const usersTotal = usersDetails.length

        const productDetails = await productService.getCheck()
        productDetails.forEach(product => {
            if(product.dataValues.Quantity <= 10) {
                lowProduct += 1
            }
        }); 
        res.render('indexadmin', {salesTotal:salesTotal,itemsTotal:itemsTotal,ordersTotal:ordersTotal,deliveryTotal:deliveryTotal,lowProduct:lowProduct,usersTotal:usersTotal})
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/get " + error })
    }
})

router.get('/brands', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Brands']
  	// #swagger.description = "Get all brands"
	// #swagger.responses[200] = {description: "Successfully retrieved all brands"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    try{
        const token = req.cookies;
        const brandsDetails = await axios.get(process.env.URL + 'brands')
        res.render('brands',{brandsDetails:brandsDetails.data.data.result})
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/brands/get " + error })
    }
})

router.post('/brands', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Brands']
  	// #swagger.description = "Create a new brand"
	// #swagger.responses[200] = {description: "Successfully created a new brand"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/createBrand"}}
    try{
        const token = req.cookies.auth_token;
        const Brand = req.body.Brand
        const brandsDetails = await axios.post(process.env.URL +'brands', {Brand:Brand},{headers: {'Authorization': `Bearer ${token}`}})
        res.redirect('/admin/brands')
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/brands/post " + error })
    }
})

router.post('/brands/edit', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Brands']
  	// #swagger.description = "Edit an existing brand"
	// #swagger.responses[200] = {description: "Successfully edited the brand"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/editBrand"}}
     // #swagger.parameters['BrandId'] = {"in": "path",description: "ID number of a specific brand", "required": true, "type": "integer"}
    try{
        const token = req.cookies.auth_token;
        const BrandId = parseInt(req.body.brandId)
        const NewBrand = req.body.NewBrand
        const brandsDetails = await axios.put(process.env.URL +'brands', {BrandId:BrandId,NewBrand:NewBrand},{headers: {'Authorization': `Bearer ${token}`}})
        res.redirect('/admin/brands')
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/brands/edit/post " + error })
    }
})

router.post('/brands/delete', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Brands']
  	// #swagger.description = "Delete an existing brand"
	// #swagger.responses[200] = {description: "Successfully deleted the brand"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['BrandId'] = {"in": "path",description: "ID number of a specific brand", "required": true, "type": "integer"}
    try{
        const token = req.cookies.auth_token;
        const BrandId = req.body.BrandId
        const brandDelete = await axios.delete(process.env.URL +`brands/${BrandId}`,{headers: {'Authorization': `Bearer ${token}`}})
        res.redirect('/admin/brands')
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/brands/delete/post " + error })
    }
})

router.get('/categories', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Categories']
  	// #swagger.description = "Get all categories"
	// #swagger.responses[200] = {description: "Successfully retrieved all categories"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    try{
        const token = req.cookies.auth_token;
        const categoriesDetails = await axios.get(process.env.URL +'categories',{headers: {'Authorization': `Bearer ${token}`}})
        res.render('categories',{categoriesDetails:categoriesDetails.data.data.result})
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/categories/get " + error })
    }
})

router.post('/categories', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Categories']
  	// #swagger.description = "Create a new category"
	// #swagger.responses[200] = {description: "Successfully created a new category"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/createCategory"}}
    try{
        const token = req.cookies.auth_token;
        const Category = req.body.Category
        const categoriesDetails = await axios.post(process.env.URL +'categories', {Category:Category},{headers: {'Authorization': `Bearer ${token}`}})
        res.redirect('/admin/categories')
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/categories/post " + error })
    }
})

router.post('/categories/edit', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Categories']
  	// #swagger.description = "Edit an existing category"
	// #swagger.responses[200] = {description: "Successfully edited the category"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/editCategory"}}
    // #swagger.parameters['CategoryId'] = {"in": "path",description: "ID number of a specific category", "required": true, "type": "integer"}
    try{
        const token = req.cookies.auth_token;
        const CategoryId = parseInt(req.body.CategoryId)
        const NewCategory = req.body.NewCategory
        const categoriesDetails = await axios.put(process.env.URL +'categories', {CategoryId:CategoryId,NewCategory:NewCategory},{headers: {'Authorization': `Bearer ${token}`}})
        res.redirect('/admin/categories')
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/categories/edit/post " + error })
    }
})

router.post('/categories/delete', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Categories']
  	// #swagger.description = "Delete an existing category"
	// #swagger.responses[200] = {description: "Successfully deleted the category"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['CategoryId'] = {"in": "path",description: "ID number of a specific category", "required": true, "type": "integer"}
    try{
        const token = req.cookies.auth_token;
        const CategoryId = req.body.CategoryId
        const categoryDelete = await axios.delete(process.env.URL +`categories/${CategoryId}`,{headers: {'Authorization': `Bearer ${token}`}})
        res.redirect('/admin/categories')
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/categories/delete/post " + error })
    }
})

router.get('/products', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Products']
  	// #swagger.description = "Get all products"
	// #swagger.responses[200] = {description: "Successfully retrieved all products"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    try{
        const token = req.cookies.auth_token;
        const productsDetails = await axios.get(process.env.URL +'products',{headers: {'Authorization': `Bearer ${token}`}})
        res.render('products',{productsDetails:productsDetails.data.data.result})
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/products/get " + error })
    }
})

router.post('/products', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Products']
  	// #swagger.description = "Create a new product"
	// #swagger.responses[200] = {description: "Successfully created a new product"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/createProduct"}}
    try{
        const token = req.cookies.auth_token;
        const Name = req.body.Name
        const Description = req.body.Description
        const UnitPrice = req.body.UnitPrice
        const ImageURL = req.body.ImageURL
        const Quantity = req.body.Quantity
        const BrandName = req.body.BrandName
        const CategoryName = req.body.CategoryName
        const productDetails = await axios.post(process.env.URL +'products', {Name:Name,Description:Description,UnitPrice:UnitPrice,ImageURL:ImageURL,Quantity:Quantity,BrandName:BrandName,CategoryName:CategoryName},{headers: {'Authorization': `Bearer ${token}`}})
        res.redirect('/admin/products')
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/products/post " + error })
    }
})

router.post('/products/edit', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Products']
  	// #swagger.description = "Edit an existing product"
	// #swagger.responses[200] = {description: "Successfully edited the product"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/editProduct"}}
    // #swagger.parameters['productId'] = {"in": "path",description: "ID number of a specific product", "required": true, "type": "integer"}
    try{
        const token = req.cookies.auth_token;
        const productId = parseInt(req.body.productId)
        const NewName = req.body.NewName
        const NewDescription = req.body.NewDescription
        const NewUnitPrice = parseInt(req.body.NewUnitPrice)
        const NewImageURL = req.body.NewImageURL
        const NewQuantity = parseInt(req.body.NewQuantity)
        const NewBrandName = req.body.NewBrandName
        const NewCategoryName = req.body.NewCategoryName
        const productDetails = await axios.put(process.env.URL +'products', {productId:productId,NewName:NewName,NewDescription:NewDescription,NewUnitPrice:NewUnitPrice,NewImageURL:NewImageURL,NewQuantity:NewQuantity,NewBrandName:NewBrandName,NewCategoryName:NewCategoryName},{headers: {'Authorization': `Bearer ${token}`}})
        res.redirect('/admin/products')
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/products/edit/post " + error })
    }
})

router.post('/products/delete', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Products']
  	// #swagger.description = "Soft delete an existing product"
	// #swagger.responses[200] = {description: "Successfully deleted the product"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['productId'] = {"in": "path",description: "ID number of a specific product", "required": true, "type": "integer"}
    try{
        const token = req.cookies.auth_token;
        const productId = parseInt(req.body.productId)
        const productDelete = await axios.delete(process.env.URL +`products/${productId}`,{headers: {'Authorization': `Bearer ${token}`}})
        res.redirect('/admin/products')
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/products/delete/post " + error })
    }
})


router.get('/orders', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Orders']
  	// #swagger.description = "Get all orders"
	// #swagger.responses[200] = {description: "Successfully retrieved all orders"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    try{
        const token = req.cookies.auth_token;
        const ordersDetails = await axios.get(process.env.URL +'orders',{headers: {'Authorization': `Bearer ${token}`}})
        const orderStatusDetails = await orderStatusService.get()
        res.render('orders',{ordersDetails:ordersDetails.data.data.result, orderStatusDetails:orderStatusDetails})
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/orders/get " + error })
    }
})

router.post('/orders/edit', isAuth, isAdmin, async function(req, res){
    // #swagger.tags = ['Admin-Orders']
  	// #swagger.description = "Edit an existing order status"
	// #swagger.responses[200] = {description: "Successfully edited the orders status"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/editOrder"}}
    // #swagger.parameters['OrderId'] = {"in": "path",description: "ID number of a specific order", "required": true, "type": "integer"}
    try{
        const token = req.cookies.auth_token;
        const NewOrderStatusId = parseInt(req.body.newOrderStatusId)
        const OrderId = parseInt(req.body.OrderId[0])
        const productDetails = await axios.put(process.env.URL +'orders', {OrderId:OrderId, NewOrderStatusId:NewOrderStatusId},{headers: {'Authorization': `Bearer ${token}`}})
        res.redirect('/admin/orders')
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/orders/edit/put " + error })
    }
})

router.get('/users', isAuth, isAdmin, async function(req, res, next){
    // #swagger.tags = ['Admin-Users']
  	// #swagger.description = "Get all users"
	// #swagger.responses[200] = {description: "Successfully retrieved all users"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    try{
        const token = req.cookies.auth_token;
        const usersDetails = await axios.get(process.env.URL +'users',{headers: {'Authorization': `Bearer ${token}`}})
        res.render('users', {usersDetails:usersDetails.data.data.result})
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/orders/get " + error })
    }
})


module.exports = router;