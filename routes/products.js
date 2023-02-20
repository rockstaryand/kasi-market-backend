var express = require("express");
var router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
if (supabase) {
  console.log("Supabase client has been created");
} else {
  console.log("Supabase client has not been created");
}

router.get("/products", function (req, res, next) {
  supabase
    .from("Products")
    .select("*")
    .then(({ data: products, error }) => {
      if (error) {
        console.error(error);
        res.status(500).send(error);
      } else {
        console.log(products);
        res.json(products);
      }
    });
});

module.exports = router;
