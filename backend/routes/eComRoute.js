const express = require('express');
const { eComData, getAuth, getProductById } = require('../controller/eComController');
const router = express.Router();




router.route("/companies/:companyname/categories/:categoryname/products").get(eComData);
router.route("/auth").get(getAuth);
router.get('/product/:id', getProductById);

module.exports = router;