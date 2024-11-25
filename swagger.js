const swaggerAutogen = require('swagger-autogen')()
const doc = {
    info: {
        version: "1.0.0",
        title: "My API",
        description: "Documentation automatically generated by the <b>swagger-autogen</b> module."
    },
    host: "localhost:3000",
    definitions: {
        loginInfo: {
            $EmailorUsername: "'sample@sample.com'/'johnDoe'",
            $Password: "123456",
        },
        signupInfo: {
            $FirstName: "John",
            $LastName: "Doe",
            $Username: "johnDoe",
            $Password: "123456",
            $Address: "somewhere, earth",
            $Email: "sample@sample.com",
            $Telephone: "00123456789",
        },
        createBrand: {
            $Brand: "Example Brand",
        },
        editBrand: {
            $NewBrand: "Edited Brand",
        },
        createCategory: {
            $Category: "Example Category",
        },
        editCategory: {
            $NewCategory: "Edited Category",
        },
        createProduct: {
            $Name: "Product Example",
            $Description: "Product description ....",
            $UnitPrice: 15,
            $ImageURL: "http://images.restapi.co.za/products/product-apple-tv.png",
            $Quantity: 5,
            $BrandName: "Example Brand",
            $CategoryName: "Example Category"
        },
        editProduct: {
            $NewName: "Edited Product",
            $NewDescription: "Edited Product description ....",
            $NewUnitPrice: 15,
            $NewImageURL: "http://images.restapi.co.za/products/product-apple-tv.png",
            $NewQuantity: 5,
            $NewBrandName: "Edited Brand",
            $NewCategoryName: "Edited Category"
        },
        editOrder: {
            $NewOrderStatusId: 1,
        },
        searchProduct: {
            $productName: "Product Name",
            $brandName: "Brand Name",
            $categoryName: "Category Name",
        },
        createCart: {
            $Quantity: 5,
        },
        editCart: {
            $NewQuantity: 1,
        },
    }
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./bin/www')
})