var express = require('express');
var router = express.Router();
const jsend = require('jsend')
var db = require("../models");
const BrandService = require('../services/BrandService')
const brandService = new BrandService(db);
const ProductService = require('../services/ProductService')
const productService = new ProductService(db);
const isAdmin = require('../middleware/isAdmin');
const isAuth2 = require('../middleware/isAuth2');

router.use(jsend.middleware);

router.get('/', async function(req, res, next){
    // #swagger.tags = ['Brands']
  	// #swagger.description = "Get all brands"
	// #swagger.responses[200] = {description: "Successfully retrieved all brands"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    try{
        const brands = await brandService.get()
        res.jsend.success({ "statusCode": 200, "result": brands })
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

router.post('/', isAuth2, isAdmin, async function(req, res, next){
    // #swagger.tags = ['Brands']
  	// #swagger.description = "Create a new brand"
	// #swagger.responses[200] = {description: "Successfully created a new brand"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/createBrand"}}
    try{
        const user = req.Username
        const {Brand} = req.body;
        const newBrand = await brandService.create(Brand);
        res.jsend.success({ "statusCode": 200, "result": "Successfully created new brand: " + newBrand.dataValues.Brand })
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

router.put('/', isAuth2, isAdmin, async function(req, res, next){
    // #swagger.tags = ['Brands']
  	// #swagger.description = "Edit an existing brand"
	// #swagger.responses[200] = {description: "Successfully edited the brand"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/editBrand"}}
    // #swagger.parameters['BrandId'] = {"in": "path",description: "ID number of a specific brand", "required": true, "type": "integer"}
    try{
        const {BrandId, NewBrand} = req.body;
        const updatedBrand = await brandService.updateBrand(BrandId, NewBrand)
        res.jsend.success({ "statusCode": 200, "result": "Successfully updated brand" })
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

router.delete('/:BrandId', isAuth2, isAdmin, async function(req, res, next){
     // #swagger.tags = ['Brands']
  	// #swagger.description = ""Delete an existing brand"
	// #swagger.responses[200] = {description: "Successfully deleted the brand"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['authorization'] = {in: "header",description: "Admin Only! Bearer token to authorize the request",required: true,type: "string"}
    // #swagger.parameters['BrandId'] = {"in": "path",description: "ID number of a specific brand", "required": true, "type": "integer"}
    try{
        var count = 0;
        const BrandId = req.params.BrandId
        const productsInCategory = await productService.getCheck()
        productsInCategory.forEach(product => {
            if(product.dataValues.BrandId == BrandId){
                count++;
            }
        });

        if(count > 0){
            res.jsend.fail({ "statusCode": 400, "result": "Unable to delete. Brand is in use."})
        } else {
            const deletedBrand = await brandService.deleteBrand(BrandId)
            res.jsend.success({ "statusCode": 200, "result": "Successfully deleted brand"})
        }

    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! " + error })
    }
})

module.exports = router;