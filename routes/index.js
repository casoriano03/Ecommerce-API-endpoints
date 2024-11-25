var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // #swagger.tags = ['Homepage']
  	// #swagger.description = "Get Homepage"
	  // #swagger.responses[200] = {description: "Successfully retrieved homepage"}
	  // #swagger.responses[400] = {description: "Fail! Something went wrong"}
    try{
      res.render('index', { title: 'Express' });
    } catch(error) {
      res.jsend.fail({ "statusCode": 400, "result": "Something went wrong! admin/orders/edit/put " + error })
    }
});

module.exports = router;
