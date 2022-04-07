const express = require("express");
const jwt = require("jsonwebtoken")
const cors = require("cors")
const { pool } = require("./db");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const { generateAccessToken } = require("./middleware/auth")
const app = express();

const PORT = 8080;

// const initializePassport = require("./passportConfig");

// initializePassport(passport);

// Middleware

// Parses details from a form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.set("view engine", "ejs");
app.use(cors())
app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());

app.get("/", (req, res) => {
  //   res.render("index");
  console.log("index")
});

app.post("/registration", async (req, res) => {
  try {
    console.log(req.body, "xsx")
    const { firstname, lastname, email, password } = req.body;

    const userExist = await new Promise((resolve, reject) => {
      pool.query('SELECT * from customer where email = ($1)', [email], (error, result) => {
        if (error) {
        throw error
        }
        resolve(result.rowCount)
      })
    })
    if (userExist > 0) {
      return res.send({meggage:"User already exists"});
    }
   await new Promise((resolve, reject) => {
      pool.query('INSERT INTO customer (firstname,lasttname,email,password) VALUES ($1, $2, $3, $4)', [firstname, lastname, email, password], (error, result) => {
        if (error) {
          throw error
        }
        resolve()
      })
    })
    
      return res.send({success:true,})
  

  } catch (error) {
    return res.send("error")
  }

});

// login api
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password, "body")
    let user = await new Promise((resolve, reject) => {
      pool.query('SELECT * from customer where (email) = ($1)', [email], (error, result) => {
        if (error) {
          throw error;
        }
        console.log(result.rows, "rows are here");
        resolve(result.rows)
      })
    })
    console.log(user)

    if (user[0].email == email) {
      console.log(user[0])
      if (user[0].password == password) {
        let accessToken = generateAccessToken({ userId: user[0].id, firstName: user[0].firstname })
      
        return res.send({ success: true, token: accessToken });
      }
      else {
        return res.send({meggage:"Your pasword is wrong"});
      }

    }
    else {
      return res.send({message:"Your email is invalid"});
    }

  } catch (error) {
    console.log(error)
    return res.send({message:"error"})
  }

});


app.listen(PORT, () => {
  console.log("your server start")
})