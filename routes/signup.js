var express = require("express");
var router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.post("/signup", (req, res) => {
  // Get the user's email and password from the request body

  const { email, password } = req.body;

  // Use the auth.createUser method to create a new Supabase auth user
  supabase.auth
    .signUp({
      email: email,
      password: password,
      data: {
        name: "Mihlali",
        phone: "555-555-5556",
      },
    })
    .then((response) => {
      console.log(response.data.user);

      res.json({ message: "User created successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error creating user" });
    });
});
module.exports = router;
