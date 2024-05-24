var express = require('express');
var router = express.Router();
var productModel = require('../models/product')

//getALL
router.get('/', async (req, res) =>{
    try {
        let products = await productModel.find()

        return res.status(200).send({
            data: products,
            message: "get success"
        })

    }catch (err) {
        return res.status(err.status || 500).send({
            message: err.message
        })
    }
})

//getByID
router.get('/:id', async (req, res) => {
    try {

        let id = req.params.id
        let product = await productModel.findById(id)

        return res.status(200).send({
            data: product,
            message: "get by id success"
        })

    } catch (err) {
        return res.status(err.status || 500).send({
            message: err.message
        })
    }
})

//create
router.post('/create', async (req, res) => {
    try {
        let body = req.body;

        let new_product = new productModel ( {
            product_id: body.product_id,
            product_name: body.product_name,
            price: body.price,
            amount: body.amount,
            detail: body.detail
        })

        let product = await new_product.save()

        return res.status(201).send({
            data: product,
            message: "เพิ่มสินค้าใหม่แล้ว"
        })

    } catch (err) {
        return res.status(err.status || 500).send({
            message: err.message
        })
    }

})

//update
router.put('/:id', async (req, res) => {
    try {
        let id = req.params.id
        let body = req.body

        await productModel.updateOne(
            { _id: id},
            { $set: {
                product_id: body.product_id,
                product_name: body.product_name,
                price: body.price,
                amount: body.amount,
                detail: body.detail
            }}
        )

        let product = await productModel.findById(id)
        return res.status(200).send({
            data: product,
            message: "แก้ไขสินค้าสำเร็จ"
        })


    } catch (err) {
        return res.status(err.status || 500).send({
            message: err.message
        })
    }
})

//delete
router.delete('/:id', async(req, res) =>{
    try {
        let id = req.params.id

        await productModel.deleteOne({ _id: id})
        let product = await productModel.find()

        return res.status(200).send({
            data: product,
            message: "ลบสินค้าแล้ว"
        })

    } catch (err) {
        return res.status(err.status || 500).send({
            message: err.message
        })
    }
})

module.exports = router;