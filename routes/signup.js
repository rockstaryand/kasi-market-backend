var express = require("express");
var router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.post("/signup", async (req, res) => {
  // Get the user's email and password from the request body

  const { email, password } = req.body;
  try {
    const { data: {user}, error } = await supabase.auth
    .signUp({
      email: email,
      password: password,
      data: {
        user
      },
    });
    console.log(response.data.user);

    res.json({ message: "User created successfully" });
  } catch(error) {
    if (error?.response?.status === 401) {
      console.error("Incorrect email or password");
    } else {
      console.error(error);
      res.status(500).json({ message: "Error creating user" });
    }
  }
});
module.exports = router;
