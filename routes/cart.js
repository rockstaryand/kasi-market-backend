const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = (redisClient) => {
    const router = express.Router();

    // Get all cart items for a user
    router.get('/cart', async (req, res) => {
        const cacheKey = "cart";

        try {
            redisClient.get(cacheKey, async (err, cachedData) => {
                if (err) {
                    console.error("Redis error:", err);
                    return res.status(500).send({ message: "Internal Server Error" });
                }

                if (cachedData) {
                    // Return cached data
                    console.log("Cache hit");
                    return res.json(JSON.parse(cachedData));
                } else {
                    const { data, error } = await supabase
                        .from('Cart')
                        .select('*')
                    if (error) {
                        return res.status(500).json({ message: 'Error fetching cart', error });
                    }

                    res.json(data);
                }

            })
        } catch (error) {
            console.error("Unexpected error:", error);
            res.status(500).send({ message: "Unexpected error occurred" });
        }


    });

    // Add an item to the cart
    router.post('/cart', async (req, res) => {
        const { product_id, quantity } = req.body;
        const { data, error } = await supabase
            .from('Cart')
            .insert([{ product_id, quantity }])
            .select();

        if (error) {
            return res.status(500).json({ message: 'Error adding item to cart', error });
        }
        res.status(201).json(data);
        console.log(data, 'what data');
    });

    // Update cart item quantity
    router.put('/cart/:id', async (req, res) => {
        const { quantity } = req.body;
        const { id } = req.params;

        const { data, error } = await supabase
            .from('Cart')
            .update({ quantity })
            .eq('id', id)
            .select();

        if (error) {
            return res.status(500).json({ message: 'Error updating cart item', error });
        }

        res.json(data);
    });

    // Remove an item from the cart
    router.delete('/cart/:id', async (req, res) => {
        const { id } = req.params;

        const { error } = await supabase
            .from('Cart')
            .delete()
            .eq('id', id);

        if (error) {
            return res.status(500).json({ message: 'Error removing item from cart', error });
        }

        res.status(204).send();
    });

    return router;
}

