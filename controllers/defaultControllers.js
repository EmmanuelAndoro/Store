const mailer = require("../misc/mailer");
const { Store } = require("../models/store");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const bcrypt = require("bcryptjs");
module.exports = {
    index:(req,res)=>{
        const pageTitle = "Home"
        const PageHeading ="Home"
        res.render('index', {pageTitle, PageHeading});
    },
    registerGet:(req,res)=>{
        const pageTitle = "Register"
        res.render('register', {pageTitle});
    },
    //A cpu intensive authentification
    registerPost:async(req, res)=>{
        const pageTitle ="Register"
    //    console.log("Submitted Data", req.body);

       await Store.findOne({email: req.body.email}).then(async(store)=>{
           if(store){
               req.flash("error-message", "Email already Exist");
               console.log("user exist")
                return res.redirect("/login")
           }else{
               const secretToken = randomstring.generate();// inside generate {length: 7, charset: alphanumeric}
               const newStore = await new Store({
                   storeName:req.body.storeName,
                   address: req.body.address,
                   email:req.body.email,
                   password: req.body.password,
                   secretToken: secretToken
               });
               console.log("This is New Store", newStore);

               //hashing of a password
             await bcrypt.genSalt(10, async(err, salt)=>{
                 await bcrypt.hash(newStore.password, salt, async(err, hash)=>{
                     newStore.password = hash;

                     console.log("This is New password hash", newStore);

                     //compose email with our new ES6 template literal="backtick"
                     const html = `Hello${req.body.storeName} <br/><br/>
                     Thank you for registering a new Account with nHub Stores.<br/>
                     Please follow the link bellow to complete your registeration:<br/><br/>

                     <a href="http://${req.headers.host}/Verify-Store/${secretToken}">http://${req.headers.host}/Verify-Store/${secretToken}</a>

                     <br/><br/>
                     <strong>Kind regards </strong><br/> <br/>
                     <strong>Nhub Stores</strong>`

                     //sending of the mail
                     await mailer.sendEmail("", req.body.email, "Please verify Your Account", html)

                    await newStore.save();
                    req.flash("success-message", "Registration Successfully!!!");
                    res.redirect("/login");
                 })
             });
           }
       });
      
    },
    storeVerify:async(req, res)=>{
        const verifyToken = req.params.token;

        //find store to verify
       await Store.findOne({"secretToken":verifyToken}, async(err, store)=>{
            if(!store){
                req.flash("error-message", "Sorry your Token is Invalid or you have been verified");
                return res.redirect("/");
            }else{
                store.active = true;
                store.secretToken = "";
                await store.save()

                req.flash("success-message", "Your Account has been activated Successfully");
                res.redirect("/login");
            }
        });
    },

    loginGet:(req,res)=>{
        const pageTitle = "Login"
        res.render('login', {pageTitle});
    },
    loginPost:(req, res, next)=>{
        const pageTitle = "Login"
       
        console.log("This is the login body", req.body)
        req.flash(("success_message", "Login successfully!!!"))
        // res.redirect("/")
    },
    about:(req,res)=>{
        const pageTitle = "About";
        const PageHeading = "About";
        res.render('about',{pageTitle, PageHeading})

    },
    contact:(req, res)=>{
        const pageTitle = "Contact"
        const PageHeading = "Contact Us"
        res.render('contact',{pageTitle, PageHeading})
    },
    news:(req, res)=>{
        const pageTitle = "News"
        const PageHeading = "News"
        res.render('news', {pageTitle, PageHeading})
    },
    farmingpractice:(req, res)=>{
        const pageTitle = "Farming Practice"
        const PageHeading = "Farming Practice"
        res.render('farmingpractice', {pageTitle, PageHeading})
    },
    ourproduct:(req, res)=>{
        const pageTitle = "Our Product"
        const PageHeading = "Our Product"
        res.render('ourproduct', {pageTitle, PageHeading})
    }
}
