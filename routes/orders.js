var express = require('express');
var router = express.Router();
var orderModel = require('../models/order')
var productModel = require('../models/product')
var userModel = require('../models/user');
const { DateTime } = require('luxon');

const getCurrentThaiDate = () => {
    return DateTime.now().setZone('Asia/Bangkok').toJSDate();
  };

//getALL
router.get('/', async (req, res) => {
    try {
        let orders = await orderModel.find()

        return res.status(200).send({
            data: orders,
            message: "get success"
        })

    } catch (err) {
        return res.status(err.status || 500).send({
            message: err.message
        })
    }
})

//getByID
router.get('/:id', async (req, res) => {
    try {

        let id = req.params.id
        let order = await orderModel.findById(id)

        return res.status(200).send({
            data: order,
            message: "get by id success"
        })

    } catch (err) {
        return res.status(err.status || 500).send({
            message: err.message
        })
    }
})

//สุ่มรหัส order
function generateRandomInt16Digits() {
    const min = Math.pow(10, 15);  // ค่าเลขต่ำสุดที่มี 16 หลัก
    const max = Math.pow(10, 16) - 1;  // ค่าเลขสูงสุดที่มี 16 หลัก
    const randomInt = Math.floor(min + Math.random() * (max - min + 1));
    return randomInt;
}

//create
router.post('/create', async (req, res) => {
    try {
        // let body = req.body;
        // const item_list = body.item_list;
        const buyer_id = req.auth.username;
        // console.log(buyer_id);

        // Destructuring
        const { item_list } = req.body;
        const random16DigitInt = generateRandomInt16Digits();

        let total_price = 0;

        if (!item_list || !Array.isArray(item_list) || item_list.length === 0) {
            return res.status(400).send({
                message: 'รายการสินค้าควรมีอย่างน้อย 1 สินค้า.'
            });
        }

        // ค้นหารายการในตาราง products และคำนวณ total_price
        for (let item of item_list) {
            // console.log(item.product_id);
            const product = await productModel.findOne({ product_id: item.product_id });

            if (!product) {
                return res.status(400).send({ message: `ไม่พบรหัสสินค้า ${item.product_id} ` });
            }

            total_price += product.price * item.amount;

            // ลบจำนวน amount จาก product
            product.amount -= item.amount;

            // ตรวจสอบว่าจำนวนไม่ติดลบ
            if (product.amount < 0) {
                return res.status(400).send({ message: `จำนวนสินค้าของ ${item.product_id} ไม่เพียงพอ` });
            }

            await product.save();
        }

        const currant_date = getCurrentThaiDate();

        let order_product = new orderModel({
            order_id: random16DigitInt,
            buyer_id,
            total_price,
            order_date: currant_date,
            item_list
        });

        let order = await order_product.save();

        return res.status(201).send({
            // data: order,
            message: "สร้างคำสั่งซื้อแล้ว"
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
            { _id: id },
            {
                $set: {
                    product_id: body.product_id,
                    product_name: body.product_name,
                    price: body.price,
                    amount: body.amount,
                    detail: body.detail
                }
            }
        )

        let product = await productModel.findById(id)
        return res.status(200).send({
            data: product,
            message: "แก้ไขคำสั่งซื้อสำเร็จ"
        })

    } catch (err) {
        return res.status(err.status || 500).send({
            message: err.message
        })
    }
})

//delete
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const order = await orderModel.findById(id);

        if (!order) {
            return res.status(404).send({ message: "ไม่พบรหัสคำสั่งซื้อ" });
        }

        // เพิ่มจำนวน amount ของสินค้าแต่ละชิ้นใน item_list
        const itemList = order.item_list;
        for (let item of itemList) {

            //แบบใช้ $inc operator
            // await productModel.updateOne(
            //     { product_id: item.product_id },
            //     { $inc: { amount: item.amount } }
            // );

            //แบบเพิ่มและบันทึกทีละรายการ
            let product = await productModel.findOne({ product_id: item.product_id });
            if (product) {
                // เพิ่มจำนวน amount ของ product
                product.amount += item.amount;
                await product.save(); // บันทึก product ที่อัปเดตกลับไปที่ฐานข้อมูล
            }

        }

        // ลบรายการสั่งซื้อหลังจากอัปเดตสินค้า
        await orderModel.findByIdAndDelete(id);

        return res.status(200).send({
            // data: order,
            message: `ยกเลิกคำสั่งซื้อ ${id} แล้ว`
        })

    } catch (err) {
        return res.status(err.status || 500).send({
            message: err.message
        })
    }
})


module.exports = router;