const express = require("express");
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express();

// middleware
app.use(express.json()) // to parse the json body from request and converts to js object.

app.post('/signup', async (req, res)=>{
  // const userobj = {
  //   firstName: "Rohan",
  //   lastName: "Gore",
  //   emailId: "rg@gmail.com",
  //   password:"123",
  // }

  console.log(req.body)



  // creating instance of new User model
  const user = new User(req.body)

  try {
    await user.save()
    
    res.send("User Added Successfully")

  } catch (error) {
    res.status(400).send("Error saving the user: "+ error.message)
  }
  
})

connectDB()
  .then(() => {
    console.log("DB connection Successful")

    app.listen(7777, () => {
    console.log("Server is listening");
  });
  })
  .catch(() => {
    console.error("DB connection falied")
  });


