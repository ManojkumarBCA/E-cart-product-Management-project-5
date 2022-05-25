const productModel = require("../Models/productModel");
const validator = require('../middleware/validation');
const aws = require('../aws/aws');



const pProducts = async function (req, res) {
    try {
        let body = JSON.parse(JSON.stringify(req.body));
        if (Object.keys(body).length == 0) {
            return res.status(400).send({ status: false, msg: "Plz Enter Data Inside Body !!!" });
        }

        const { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = body;

        if (!title) {
            return res.status(400).send({ status: false, msg: "Plz Enter title In Body !!!" });
        }

        if (!description) {
            return res.status(400).send({ status: false, msg: "Plz Enter description In Body !!!" });
        }

        if (!price) {
            return res.status(400).send({ status: false, msg: "Plz Enter price In Body !!!" });
        }

        if (!currencyId) {
            return res.status(400).send({ status: false, msg: "Plz Enter currencyId In Body !!!" });
        }

        if (!currencyFormat) {
            return res.status(400).send({ status: false, msg: "Plz Enter currencyFormat In Body !!!" });
        }

        if (currencyFormat != '₹') {
            return res.status(400).send({ status: false, msg: "Plz Use Indian Currency Format(₹) In Body !!!" });
        }

        if (!isFreeShipping) {
            return res.status(400).send({ status: false, msg: "Plz Enter isFreeShipping In Body !!!" });
        }

        if (!style) {
            return res.status(400).send({ status: false, msg: "Plz Enter style In Body !!!" });
        }

        console.log(availableSizes)
        if (!availableSizes) {
            return res.status(400).send({ status: false, msg: "Plz Enter availableSizes In Body !!!" });
        }

        if (availableSizes == 'S' || availableSizes == 'XS' || availableSizes == 'M' || availableSizes == 'X' || availableSizes == 'L' || availableSizes == 'XXL' || availableSizes == 'XL') {
            if (!installments) {
                return res.status(400).send({ status: false, msg: "Plz Enter installments In Body !!!" });
            }
            if (isNaN(installments) == true) {
                return res.status(400).send({ status: false, msg: "Plz Enter Number In installments !!!" });
            }


            let files = req.files;
            if (files && files.length > 0) {
                let uploadedFileURL = await aws.uploadFile(files[0]);
                productImage = uploadedFileURL;

                let userData = { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments };
                const savedData = await productModel.create(userData);
                res.status(201).send({ status: true, data: savedData });
            }
            else {
                return res.status(400).send({ status: false, msg: "No file found" });
            }
        } else {
            return res.status(400).send({ status: false, msg: "Plz Enter availableSizes From S, XS, M, X, L, XXL, XL" });
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};



module.exports = { pProducts };