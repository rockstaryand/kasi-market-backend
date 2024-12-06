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

router.get("/stores/:storeId", async function (req, res) {
    const storeId = req.params.storeId;
    // Fetch store information by storeId
    const { data: store, error: storeError } = await supabase
        .from('stores') // Replace 'Stores' with your actual stores table name
        .select('*')
        .eq('id', storeId) // Assuming 'id' is the primary key for the store
        .single(); // Return a single store object

    if (storeError) {
        console.error(storeError);
        return res.status(500).send(storeError.message);
    }

    if (!store) {
        return res.status(404).json({ message: `Store with ID ${storeId} not found` });
    }

    // Return the store information
    res.json(store);

});


router.get("/stores/:storeId/products", function (req, res, next) {
    const storeId = req.params.storeId;
    supabase
        .from("Products")
        .select("*")
        .eq("store_id", storeId) // Filter products by store_id
        .then(({ data: products, error }) => {
            if (error) {
                console.error(error);
                res.status(500).send(error); // Send server error if something goes wrong
            } else if (products.length === 0) {
                res
                    .status(404)
                    .json({ message: `No products found for store with ID ${storeId}` });
            } else {
                res.json(products); // Return all products related to the store
            }
        });
});

module.exports = router;