var express = require("express");
var router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const { response } = require("../app");

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/* Post login . */

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: "yandisatupa@gmail.com",
      password: "Pedesimuc98",
    });
    // console.log(user.id, "res user");
    res.cookie("jwt", user);
    res.send(user);
  } catch (error) {
    if (error?.response?.status === 401) {
      console.error("Incorrect email or password");
    } else {
      console.error(error);
    }
  }

  // Use the auth.sign_in method to log the user in and retrieve a JWT
});

module.exports = router;
