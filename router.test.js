require('dotenv').config();
const express = require("express");
const request = require("supertest");
const app = express();
const bodyParser = require("body-parser")

const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');

app.use(bodyParser.json());
app.use('/auth', authRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);


  let token; 
describe("testing-login valid user", () => {
 
  test("POST /login - success", async () => {
    
    var data = {
        EmailorUsername:"Admin",
        Password:"P@ssword2023"
    }

    var expectedOutput = {
        "status": "success",
        "data": {
            "result": "You are logged in",
            "id": 1,
            "Name": "Admin",
            "Email": "admin@noroff.no",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzYW1wbGVAc2FtcGxlLmNvbSIsImlhdCI6MTcxMjgyOTAyNCwiZXhwIjoxNzEzNDMzODI0fQ.e7hpVo1laGvp5tj3t_X5O23P4BLBgdFIFGcFBywHQds"
        }
    }

    const response = await request(app).post("/auth/login").send(data);
    token = response.body.data.token
    expect(response.body.data.result).toEqual(expectedOutput.data.result);
  });
});

describe("testing-login invalid user", () => {
 
  test("POST /login - fail", async () => {
    
    var data = {
        EmailorUsername:"Sample",
        Password:"123456"
    }

    var expectedOutput = {
      "status": "fail",
      "data": {
        "statusCode": 400,
        "result": "Something went wrong! TypeError [ERR_INVALID_ARG_TYPE]: The \"salt\" argument must be of type string or an instance of ArrayBuffer, Buffer, TypedArray, or DataView. Received undefined\n    at check (node:internal/crypto/pbkdf2:90:10)\n    at Object.pbkdf2 (node:internal/crypto/pbkdf2:40:5)\n    at C:\\Users\\casor\\noroff BED\\XX-EP-ECOM\\aug23ft-ep-ca-1-chris03-student\\routes\\auth.js:62:16\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
      }
    }

    const response = await request(app).post("/auth/login").send(data);
    expect(response.body.data.statusCode).toEqual(expectedOutput.data.statusCode);
  });
});


describe("testing retrieve all categories", () =>{
    test("GET /categories -success", async ()=> {

    const response = await request(app).get("/categories").set('Authorization',`Bearer ${token}`);
    expect(response.body.data.statusCode).toEqual(200);

  })
})

describe("testing adding category", () =>{
    test("POST /categories -success", async ()=> {

        var category = {
            Category:"TEST_CATEGORY"
        }
    const response = await request(app).post("/categories").send(category).set('Authorization',`Bearer ${token}`);
    expect(response.body.data.statusCode).toEqual(200);
  })
})

describe("testing editing category", () =>{
  test("PUT /categories -success", async ()=> {

      var category = {
          CategoryId: 9,
          NewCategory:"TEST_CATEGORY2"
      }
  const response = await request(app).put("/categories").send(category).set('Authorization',`Bearer ${token}`);
  expect(response.body.data.statusCode).toEqual(200);
})
})

describe("testing deleting category", () =>{
  test("DELETE /categories -success", async ()=> {

   
         var CategoryId = "9";
  
  const response = await request(app).delete("/categories/:CategoryId").send(CategoryId).set('Authorization',`Bearer ${token}`);
  expect(response.body.data.statusCode).toEqual(200);
})
})

describe("testing retrieve all products", () =>{
  test("GET /products -success", async ()=> {

  const response = await request(app).get("/products").set('Authorization',`Bearer ${token}`);
  expect(response.body.data.statusCode).toEqual(200);

  })
})

describe("testing adding products", () =>{
  test("POST /products -success", async ()=> {

      var product = {
        Name:"TEST_PRODUCT555",
        Description:"testing",
        UnitPrice:5,
        ImageURL:"imageurl",
        Quantity:100,
        BrandName:"TEST_BRAND",
        CategoryName:"TEST_CATEGORY"
      }
  const response = await request(app).post("/products").send(product).set('Authorization',`Bearer ${token}`);
  expect(response.body.data.statusCode).toEqual(200);
  })
})

describe("testing editing products", () =>{
  test("PUT /products -success", async ()=> {

      var product = {
        productId:17,
        NewName:"TEST_PRODUCT",
        NewDescription:"testing",
        NewUnitPrice:50,
        NewImageURL:"imageurl",
        NewQuantity:5,
        NewBrandName:"TEST_BRAND",
        NewCategoryName:"TEST_CATEGORY"
      }
  const response = await request(app).put("/products").send(product).set('Authorization',`Bearer ${token}`);
  expect(response.body.data.statusCode).toEqual(200);
  })
})

describe("testing deleting products", () =>{
    test("DELETE /products/:productId-success", async ()=> {

        var productId = "18";

    const response = await request(app).delete(`/products/:productId`).send(productId).set('Authorization',`Bearer ${token}`);
    expect(response.body.data.statusCode).toEqual(200);
  })
})

