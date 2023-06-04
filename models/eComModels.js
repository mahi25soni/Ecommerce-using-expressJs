const mongoose = require("mongoose")

const {validator} = require("validator")

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required : [true, "Enter your username"]
        
    },
    email : {
        type : String,
        unique : true,
        required : [true, "Enter your email"],

    },
    pass : {
        type : String,
        required : [true, "Enter your password"],
        minlength : [8, "Password is too short"]
    },
    order : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Order"
    },
    address : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Address"         
    }]
})
userSchema.post("findOneAndDelete" , function(){
    Cart.deleteMany({user : this._id}).exec()
    Order.findOneAndDelete({_id : this.order}).exec()
    Address.deleteMany({user: this._id}).exec()
})
const User = new mongoose.model("User", userSchema)


const productSchema = new mongoose.Schema({
    itemname : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    ratings : [{
        type : Number
    }],
    reviews : [{
        type : String
    }]
})

const Product = new mongoose.model("Product", productSchema)


const addressSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    plotno : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    pincode : {
        type : Number,
        required : true
    }
})
addressSchema.pre("save", async function(){
    const user = await User.findOne({_id : this.user}).exec()
    user.address.push(this._id)
    user.save()
})
const Address = new mongoose.model("Address", addressSchema)


const cartSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    product : productSchema,
    noofitems : {
        type : Number,
        default : 1,
    },
    perproduct : {
        type : Number
    }
})

cartSchema.post("save", async function(){
    const order = await Order.findOne({user : this.user}).exec()
    if (order.cart.indexOf(this._id) === -1){
        order.cart.push(this._id)
        order.save()
    }
})

const Cart = new mongoose.model("Cart", cartSchema)



const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    cart : [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Cart"
    }],
    address : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Address"
    },
    shipped : {
        type : Boolean,
        default : false
    }
})
orderSchema.pre("save", async function(){
    const user = await User.findOne({_id : this.user}).exec()
    user.order = this._id
    user.save()
})
orderSchema.pre("findOneAndDelete" , function(){
    Cart.deleteMany({user : this.user}).exec()
})

orderSchema.methods.getData =  async function(){
    const fullorder = await this.populate("cart")
    const cart = fullorder.cart
    let total_items = 0;
    let net_total = 0;
    cart.map(element => {
        total_items += element.noofitems;
        net_total += element.noofitems*element.product.price; 
    })
    return [total_items, net_total]
}
const Order = new mongoose.model("Order", orderSchema)


module.exports = {
    Cart, Order, User, Product, Address
}