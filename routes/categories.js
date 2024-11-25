var express = require('express');
var router = express.Router();
const jsend = require('jsend')
var db = require("../models");
const CategoryService = require('../services/CategoryService')
const categoryService = new CategoryService(db);
const ProductService = require('../services/ProductService');
const isAdmin = require('../middleware/isAdmin');
const isAuth2 = require('../middleware/isAuth2');
const productService = new ProductService(db);

router.use(jsend.middleware);

router.get('/', async function(req, res, next){
    // #swagger.tags = ['Categories']
  	// #swagger.description = "Get all categories"
	// #swagger.responses[200] = {description: "Successfully retrieved all categories"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    try{
        const categories = await categoryService.get()
        res.jsend.success({ "statusCode": 200, "result": categories })
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

router.post('/', isAuth2, isAdmin, async function(req, res, next){
    // #swagger.tags = ['Categories']
  	// #swagger.description = "Create a new category"
	// #swagger.responses[200] = {description: "Successfully created a new category"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/createCategory"}}
    try{
        const {Category} = req.body
        const newCategory = await categoryService.create(Category)
        res.jsend.success({ "statusCode": 200, "result": "Successfully created new category: " + newCategory.dataValues.Category})
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

router.put('/', isAuth2, isAdmin, async function(req, res, next){
    // #swagger.tags = ['Categories']
  	// #swagger.description = "Edit an existing category"
	// #swagger.responses[200] = {description: "Successfully edited the category"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/editCategory"}}
    // #swagger.parameters['CategoryId'] = {"in": "path",description: "ID number of a specific category", "required": true, "type": "integer"}

    try{
        const {CategoryId, NewCategory} = req.body
        const updatedCategory = await categoryService.updateCategory(CategoryId, NewCategory)
        res.jsend.success({ "statusCode": 200, "result": "Successfully updated category"})
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

router.delete('/:CategoryId', isAuth2, isAdmin, async function(req, res, next){
    // #swagger.tags = ['Categories']
  	// #swagger.description = "Delete an existing category"
	// #swagger.responses[200] = {description: "Successfully deleted the category"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['CategoryId'] = {"in": "path",description: "ID number of a specific category", "required": true, "type": "integer"} 
    try{
        var count = 0;
        const CategoryId = parseInt(req.params.CategoryId)
        const productsInCategory = await productService.getCheck()
        productsInCategory.forEach(product => {
            if(product.dataValues.CategoryId == CategoryId){
                count++;
            }
        });

        if(count > 0){
            res.jsend.fail({ "statusCode": 400, "result": "Unable to delete. Category is in use."})
        } else {
            const deletedCategory = await categoryService.deleteCategory(CategoryId)
            res.jsend.success({ "statusCode": 200, "result": "Successfully deleted category"})
        }
        
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

module.exports = router;