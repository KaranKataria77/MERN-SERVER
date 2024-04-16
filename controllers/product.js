var Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getProductByid = (req, res, next, id) => {
    Product
    .findById(id)
    .populate("category")
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error: "Product NOT found"
            })
        }
        req.product = product;
        next();
    })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "problem with image"
            })
        }
        //  destructure the field
        const { name, description, price, category, stock } = fields

        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error: "please include all fields"
            })
        }
        let product = new Product(fields)

        // handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        // save to Db
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error: "Saving tshirt in DB failed"
                })
            }
            res.json(product)
        })
    })

}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

// delete controller
exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete the product"
            })
        }
        res.json({
            message: "Deletion was a success",
            deletedProduct
        })
    })
}

// update product
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "problem with image"
            })
        }
        
        // updation code
        let product = req.product;
        product = _.extend(product, fields)

        // handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        // save to Db
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error: "updation of product failed"
                })
            }
            res.json(product)
        })
    })
}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
        if(err){
            return res.json({
                error: "No Products found"
            })
        }
        res.json(products)
    })
}

exports.getAllUniquecategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err){
            return res.status(400).json({
                error: "No Category found"
            })
        }
        res.json(category)
    })
}

exports.updateStock = (req, res, next) => {
    let myOperation = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {sinc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    });
    Product.bulkWrite(myOperation, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error: "Bulk operation failed"
            })
        }
        next();
    });
}
