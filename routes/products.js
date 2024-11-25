var express = require('express');
var router = express.Router();
const jsend = require('jsend')
var db = require("../models");
const ProductService = require('../services/ProductService')
const productService = new ProductService(db);
const IsDeletedService = require('../services/IsDeletedService')
const isDeletedService = new IsDeletedService(db);
const BrandService = require('../services/BrandService')
const brandService = new BrandService(db);
const CategoryService = require('../services/CategoryService');
const isAuth2 = require('../middleware/isAuth2');
const isAdmin = require('../middleware/isAdmin');
const categoryService = new CategoryService(db);


router.use(jsend.middleware);

router.get('/', async function(req, res, next){
    // #swagger.tags = ['Products']
  	// #swagger.description = "Get all products"
	// #swagger.responses[200] = {description: "Successfully retrieved all products"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    try{
        const IsDeleted = await isDeletedService.getOne("No")
        const isDeletedId = IsDeleted.dataValues.id
        const products = await productService.get(isDeletedId)
        res.jsend.success({ "statusCode": 200, "result": products })
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! products/get " + error })
    }

});

router.post('/', isAuth2, isAdmin, async function(req, res, next){
    // #swagger.tags = ['Products']
  	// #swagger.description = "Create a new product"
	// #swagger.responses[200] = {description: "Successfully created a new product"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/createProduct"}}
    try{
        const {Name, Description, UnitPrice, ImageURL, Quantity, BrandName, CategoryName} = req.body;
      
            const IsDeleted = await isDeletedService.getOne("No")
            const IsDeletedId = IsDeleted.dataValues.id
        
            var BrandId
            const brandExist = await brandService.getOne(BrandName)
            if(brandExist === null) {
                await brandService.create(BrandName)
                const addedBrand = await brandService.getOne(BrandName)
                BrandId = addedBrand.dataValues.id
            } else {
                BrandId = brandExist.dataValues.id
            }

            var CategoryId
            const categoryExist = await categoryService.getOne(CategoryName)
            if(categoryExist === null) {
                await categoryService.create(CategoryName)
                const addedCategory = await categoryService.getOne(CategoryName)
                CategoryId = addedCategory.dataValues.id
            } else {
                CategoryId = categoryExist.dataValues.id
            }
        
            const product = await productService.create(Name, Description, UnitPrice, ImageURL, Quantity, BrandName, CategoryName, BrandId, CategoryId, IsDeletedId)

        res.jsend.success({ "statusCode": 200, "result": product })
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! products/post" + error })       
    }
})

router.put('/', isAuth2, isAdmin, async function(req, res, next){
    // #swagger.tags = ['Products']
  	// #swagger.description = "Edit an existing product"
	// #swagger.responses[200] = {description: "Successfully edited the product"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/editProduct"}}
    // #swagger.parameters['productId'] = {"in": "path",description: "ID number of a specific product", "required": true, "type": "integer"}
    try{
        const {productId, NewName, NewDescription, NewUnitPrice, NewImageURL, NewQuantity, NewBrandName, NewCategoryName} = req.body
        try{
            var NewBrandId
            const NewBrandExist = await brandService.getOne(NewBrandName)
            if(NewBrandExist === null) {
                await brandService.create(NewBrandName)
                const addedBrand = await brandService.getOne(NewBrandName)
                NewBrandId = addedBrand.dataValues.id
            } else {
                const existingBrand = await brandService.getOne(NewBrandName)
                NewBrandId = existingBrand.dataValues.id
            }
        } catch(error) {
            res.status(400).json({ "statusCode": 400, "result": "Something went wrong! products/put/NewBrandId " + error })
        }
        
        try{
             var NewCategoryId
            const categoryExist = await categoryService.getOne(NewCategoryName)
            if(categoryExist === null) {
                await categoryService.create(NewCategoryName)
                const addedCategory = await categoryService.getOne(NewCategoryName)
                NewCategoryId = addedCategory.dataValues.id
            } else {
                const existingCategory = await categoryService.getOne(NewCategoryName)
                NewCategoryId = existingCategory.dataValues.id
            }
        } catch(error) {
            res.status(400).json({ "statusCode": 400, "result": "Something went wrong! products/put/NewBrandId " + error })
        }

        try{
            const updatedProduct = productService.updateProduct(productId, NewName, NewDescription, NewUnitPrice, NewImageURL, NewQuantity, NewBrandName, NewCategoryName, NewBrandId, NewCategoryId)
        } catch(error) {
            res.status(400).json({ "statusCode": 400, "result": "Something went wrong! products/put/updatedProduct " + error })
        }

        res.jsend.success({ "statusCode": 200, "result": "Successfully updated product! "})
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

router.delete('/:productId', isAuth2, isAdmin, async function(req, res, next){
    // #swagger.tags = ['Products']
  	// #swagger.description = "Soft delete an existing product"
	// #swagger.responses[200] = {description: "Successfully deleted the product"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['productId'] = {"in": "path",description: "ID number of a specific product", "required": true, "type": "integer"}
    try{
        const productId = parseInt(req.params.productId)
        const isDeleted = await isDeletedService.getOne('Yes')
        const isDeletedId = isDeleted.dataValues.id
        const softDeletedProduct = productService.softDeleteProduct(productId, isDeletedId)
        res.jsend.success({ "statusCode": 200, "result": "Successfully soft deleted product! "})
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

module.exports = router;