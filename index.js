
const express = require("express");
const app = express();
const env = require("dotenv");
const jwt = require("jsonwebtoken")

env.config();
const PORT = process.env.PORT || 7001
console.log(process.env.PORT)
const bcrypt = require("bcrypt");
const mongoConnection = require("./db/config/connection");
const userModel = require("./db/model/userModel");

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }))

mongoConnection()

app.post("/sign_in", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;



    userModel.findOne({ email: email }).then((user) => {
        if (user) {
            let userPassword = user.password;
            bcrypt.compare(password, userPassword).then((data) => {

                try {
                    let jwt_token = jwt.sign({
                        email: email,
                        user_id: user._id
                    },"secret")
                    if (jwt_token) {
                        res.send({
                            status: true,
                            error: false,
                            data: jwt_token
                        }) 
                    } else {
                        res.send({
                            status: false,
                            error: true,
                            msg: "Internal Server Error  "
                        })
                    }
                } catch (e) {
                    console.log(e)
                    res.send({
                        status: false,
                        error: true,
                        msg: "Internal Server Error  "
                    })
                }


            }).catch((err) => {
                console.log(err)
                res.send({
                    status: false,
                    error: true,
                    msg: "Incorrect Password"
                })
            })

        } else {
            res.send({
                status: false,
                error: true,
                msg: "User is not exist"
            })
        }
    })

})

app.post("/sign_up", async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;


    try {
        let findUser = await userModel.findOne({ email: email });
        if (findUser) {
            res.send({
                status: false,
                error: true,
                msg: "Email ID already exist"
            })
        } else {
            let newPassword = await bcrypt.hash(password, 10)
            let newUser = new userModel({
                email: email,
                name: name,
                password: newPassword,
                phone: phone,
            })
            newUser.save().then(() => {
                res.send({
                    status: true,
                    error: false,
                    msg: "User created success"
                })
            }).catch((err) => {
                res.send({
                    status: false,
                    error: true,
                    msg: "Something went wrong"
                })
            })

        }
    } catch (e) {
        res.send({
            status: false,
            error: true,
            msg: "Something went wrong"
        })
    }
})



app.listen(PORT, () => {
    console.log("Auth service started @PORT " + PORT);
})