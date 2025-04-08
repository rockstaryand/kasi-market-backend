var express = require("express");
var router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

router.get("/products", function (req, res, next) {
  supabase
    .from("Products")
    .select("*")
    .then(({ data: products, error }) => {
      if (error) {
        console.error(error);
        res.status(500).send(error);
      } else {
        res.json(products);
      }
    });
});

router.get("/products/:id", function (req, res, next) {
  const productId = req.params.id;
  supabase
    .from("Products")
    .select("*")
    .eq("id", productId)
    .then(({ data: products, error }) => {
      if (error) {
        console.error(error);
        res.status(500).send(error);
      } else if (products.length === 0) {
        res
          .status(404)
          .json({ message: `Product with ID ${productId} not found` });
      } else {
        console.log(products[0]);
        res.json(products[0]);
      }
    });
});

router.get("/products/:id/reviews", function (req, res, next) {
  const productId = req.params.id;
  supabase
    .from("Reviews")
    .select("*")
    .eq("product_id", productId)
    .then(({ data: products, error }) => {
      if (error) {
        console.error(error);
        res.status(500).send(error);
      } else if (products.length === 0) {
        res
          .status(404)
          .json({ message: `Product with ID ${productId} not found` });
      } else {
        console.log(products[0]);
        res.json(products[0]);
      }
    });
});

module.exports = router;
