const { Cart, Order, User, Product, Address } = require("../models/eComModels")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")

async function priceAndTotal(userId) {
    const your_order = await Order.findOne({'user':userId}).populate("cart").exec()
    const allcarts = your_order.cart
    let total_items = 0;
    let net_total = 0;
    await allcarts.map(element => {
        total_items += element.noofitems;
        net_total += element.noofitems*element.product.price; 
    })
    return [total_items, net_total]
}

module.exports = {
    priceAndTotal
}