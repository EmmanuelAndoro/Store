module.exports = {
    mongoDB: "mongodb://localhost/nHub-store",
    port: process.env.port || 7000,
    globalVariables: (req, res, next)=>{
        res.locals.success_message = req.flash("success-message");
        res.locals.error_message = req.flash("error-message");
        res.locals.messages = require("express-messages");
        res.locals.store =req.store ? true: false
        res.locals.session = req.session;

        next();
        }
}

