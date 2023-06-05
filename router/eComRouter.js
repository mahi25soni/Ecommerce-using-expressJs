const express = require("express")
const router = express.Router()
const {body } = require("express-validator")

const Pages = require("../controllers/eCom")
const {verifyToken} = require("../middlewares/authMid")
const {upload} = require("../middlewares/multer")


router.route("/").get(verifyToken,Pages.homePage)

router.get("/signup", Pages.signupPage)
router.post("/signup",
    body("pass2").custom((value, { req }) => {
        if (value !== req.body.pass){
            throw new Error ("Password confirmation does not match password")
        }
        return true;
    })  
,Pages.postSignup)


router.route("/login")
    .get(Pages.loginPage)
    .post(Pages.postLogin) 

router.get("/product", Pages.productPage)
router.post("/product",upload.single('myFile'), Pages.postProduct)

router.post("/addtocart/:productId", verifyToken, Pages.addToCart)
router.get("/showcart", verifyToken, Pages.showCart)
router.post("/changevalue", Pages.changeValue)

router.get("/checkout", verifyToken, Pages.checkoutPage)

router.post("/address", Pages.addAddresss)
router.post("/order", Pages.addOrder)




module.exports = router

