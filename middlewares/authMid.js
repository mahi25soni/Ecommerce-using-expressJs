const jwt = require("jsonwebtoken")

const  verifyToken = (req, res, next) => {
    const token = req.cookies["token"]
    jwt.verify(token, "my-32-character-ultra-secure-and-ultra-long-secret", (err , data) => {
        if(!err){
            req.user = data.result
            next(); 
        }
        else {
            res.redirect("/login")
        }        
    })
}

module.exports = {
    verifyToken
}