var express = require("express");
var router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/* GET users listing. */
router.get("/users", (req, res) => {
  supabase.auth
    .user()
    .then((session) => {
      res.send(session);
      console.log(session, "response");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error retrieving users" });
    });

  // }
});

module.exports = router;
