const { Cart, Order, User, Product, Address } = require("../models/eComModels")
const { priceAndTotal } = require("../services/first.service")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")




const homePage = async (req, res) => {
    const your_data = await priceAndTotal(req.user._id)

    Product.find({}, function(err, result){
        if(!err){
            res.render("home", {
                product: result,
                user: req.user.username,
                data : your_data
            })
        }
    })

}
const signupPage = (req, res) => {
    res.render("signup")
}        
const postSignup =  async (req, res) => {
    const newUser = new User({
        "username": req.body.username,
        "email": req.body.email,
        "pass": req.body.pass,
    })
    await newUser.save()
    res.redirect("/login")
}

const loginPage = (req, res) => {
    res.render("login", {
        product: 0,
        user: "",
        data : ""
    })
}

const postLogin = (req, res) => {
    const user = req.body.username
    User.findOne({username : user}, (err, result) =>{
        if(err){
            res.status(404).send("not found")
        }
        else{
            if (result.pass === req.body.pass){
                jwt.sign({result}, "my-32-character-ultra-secure-and-ultra-long-secret", (err, token) =>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.cookie("username", user)
                        res.cookie("token", token)
                        res.redirect("/")
                    }
                })  
            }
            else{
                res.send("Enter the correct password")
            }
        }
    })
}


const productPage = (req, res) => {
    res.render("addProduct")
}

const postProduct = async (req, res) => {
    const imagepath = "uploads/"+ req.file.filename; 
    const newProduct = new Product({
        itemname : req.body.itemname,
        price : req.body.price,
        image : imagepath
    })
    await newProduct.save()
    res.redirect("/product")



}
const addToCart = async (req, res) => {
    let tempname = req.user._id
    Order.findOne({user: tempname}, async function(err, order){
        if(!order){
            const newOrder = new Order({
                user : tempname
            })
            await newOrder.save()
        }
        else{
            tempname = order.user
        }
    })
    const productneeded = await Product.findOne({_id : req.params.productId}).exec()
    const check = {user : tempname, product : productneeded}
    Cart.findOne(check , async function(err, cart){
        if(cart){
            cart.noofitems += 1
            await cart.save()
            console.log(cart.noofitems)
        }
        else{
            const nothing = new Cart({
                user : tempname,
                product : productneeded,
            })
            await nothing.save()

        }
    }) 
    const your_data = await priceAndTotal(req.user._id)
    // const your_order = await Order.findOne({'user':req.user._id}).exec()
    // const your_data = await your_order.getData()

    // console.log(kiskadata, "sfhskldfhsk:", your_data)


    res.json({ "count": your_data[0] });
}

const showCart = async (req, res) => {
    try {
        const your_data = await priceAndTotal(req.user._id)

        const cart = await Cart.find({user : req.user._id}).exec();
        res.render("showCart", {
            cart: cart,
            data: your_data,
            user : req.user.username,
        });

    } catch (err) {
    console.error(err);
    }

}
const changeValue = async (req, res) => {
    const cartId = req.body.id
    const value = req.body.value
    const requiredCart = await Cart.findOne({_id : cartId}).exec()
    if(value === "remove"){
        requiredCart.delete()
    }
    else if(value === "add"){
        requiredCart.noofitems += 1; 
    }
    else{
        requiredCart.noofitems -= 1;
    }
    requiredCart.save()
    res.redirect("/showcart")
    


}
const checkoutPage = async (req, res) => {
    try {
        const order = await Order.findOne({user : req.user._id}).exec();
            const orderData = await order.getData();
            const cart = await Cart.find({user : req.user._id}).exec();
            res.render("checkout", {
                cart: cart,
                data: orderData,
                user : req.user.username
            });
        } catch (err) {
        console.error(err);
        }
}
const addAddresss = async (req, res) =>{
    const nothing = new Address({
        user : req.body.user,
        plotno : req.body.plotno,
        city : req.body.city,
        state : req.body.state,
        pincode : req.body.pincode

    })
    await nothing.save()  
    res.send("done")
}

const addOrder = async (req, res) => {
    const nothing = new Order({
        user : req.body.user,
        cart : req.body.cart,
        address : req.body.address
    })
    await nothing.save()
    res.send("done")

}
module.exports = {
    homePage,
    signupPage,
    postSignup,
    loginPage,
    postLogin,
    productPage,
    postProduct,
    addToCart,
    showCart,
    changeValue,
    checkoutPage,
    addAddresss,
    addOrder
}