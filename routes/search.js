var express = require('express');
var router = express.Router();
const jsend = require('jsend')
var db = require("../models");
const ProductService = require('../services/ProductService')
const productService = new ProductService(db);
const BrandService = require('../services/BrandService')
const brandService = new BrandService(db);
const CategoryService = require('../services/CategoryService')
const categoryService = new CategoryService(db);

router.use(jsend.middleware);

router.post('/', async function(req, res, next){
    // #swagger.tags = ['Search']
  	// #swagger.description = "Search for products based on either or in combination of product name, brand name, and category name."
	// #swagger.responses[200] = {description: "Successfully created a new brand"}
	// #swagger.responses[400] = {description: "Fail! Something went wrong"}
    // #swagger.parameters['body'] = {in: "body", "schema":{$ref:"#/definitions/searchProduct"}}
    try{
        const {productName, brandName, categoryName} = req.body

        const productSearchResult = await productService.getCheck();

        let foundItems = productSearchResult;

        if (brandName) {
            const brandDetails = await brandService.getOne(brandName);
            const brandId = brandDetails.dataValues.id;
            foundItems = foundItems.filter(product => product.BrandId === brandId);
        }

        if (categoryName) {
            const categoryDetails = await categoryService.getOne(categoryName);
            const categoryId = categoryDetails.dataValues.id;
            foundItems = foundItems.filter(product => product.CategoryId === categoryId);
        }

        if (productName) {
            foundItems = foundItems.filter(product => product.Name.includes(productName));
        }

        if (foundItems.length > 0) {
            res.jsend.success({ "statusCode": 200, "result": foundItems });
        } else {
            res.jsend.fail({ "statusCode": 404, "result": "No products found matching the criteria." });
        }
    } catch(error) {
        res.jsend.fail({ "statusCode": 400, "result": "search/post/product Something went wrong! " + error })
    }
})

module.exports = router;