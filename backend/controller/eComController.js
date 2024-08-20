const errorHandler = require('../middleware/errorHandler');
const asyncError = require("../middleware/asyncError");
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

let productData = []; // This will store the products in memory

exports.eComData = asyncError(async (req, res, next) => {
    const { companyname, categoryname } = req.params;

    if (!companyname || !categoryname) {
        return next(new errorHandler("Please provide companyname and categoryname", 400));
    }

    const { top, page = 1, min, max } = req.query;
    if (!top || !min || !max) {
        return next(new errorHandler("Please provide top, page, min, and max", 400));
    }

    const auth = await axios.get("http://localhost:7000/api/auth");
    if (top > 10 && !page) {
        return next(new errorHandler("Please provide page as top exceeds 10", 400));
    }

    const headers = {
        'Authorization': `Bearer ${auth.data.token}`
    };

    const response = await axios.get(`http://20.244.56.144/test/companies/${companyname}/categories/${categoryname}/products?top=${top}&minPrice=${min}&maxPrice=${max}`, { headers });

    // Add `id` to each product and save it to productData
    const dataWithId = response.data.map(product => ({
        id: uuidv4(),  // Generate a UUID for each product
        ...product
    }));

    // Sort the data by price in ascending order
    function sortData(data) {
        for (let i = 0; i < data.length - 1; i++) {
            for (let j = 0; j < data.length - i - 1; j++) {
                if (data[j].price > data[j + 1].price) {
                    // Swap the elements
                    let temp = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = temp;
                }
            }
        }
        return data;
    }

    // Sort the data by price in ascending order
    const sortedData = sortData(dataWithId);

    // Pagination logic
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the data for the current page
    const paginatedData = sortedData.slice(startIndex, endIndex);

    // Store the sorted and paginated data in the productData array
    productData = sortedData;

    // Respond with paginated data and additional pagination info
    res.status(200).json({
        status: true,
        message: "success",
        data: paginatedData,
        totalPages: Math.ceil(sortedData.length / itemsPerPage),
    });
});

exports.getProductById = asyncError(async (req, res, next) => {
    const { id } = req.params;


    const product = productData.find(p => p.id === id);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    res.status(200).json({
        status: true,
        message: "success",
        data: product,
    });
});




exports.getAuth = asyncError(async (req, res, next) => {
    const data = JSON.stringify({
        "companyName": "BBDITM",
        "clientID": "1b804da8-ae7e-4923-9d2f-08196b84637a",
        "clientSecret": "wyemObimAyzudxHh",
        "ownerName": "Rohit Kumar Sharma",
        "ownerEmail": "rohitsharma2k3@gmail.com",
        "rollNo": "2100540100141"
    });

    try {
        const response = await axios.post('http://20.244.56.144/test/auth', data, {
            headers: {
                'Content-Type': 'application/json'
            },
            maxBodyLength: Infinity,
        });

        res.status(200).json({
            status: true,
            message: "success",
            token: response.data.access_token
        });
    } catch (error) {
        return next(new errorHandler(error, 403));
    }
});