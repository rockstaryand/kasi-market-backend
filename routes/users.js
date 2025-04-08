var express = require("express");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = (redisClient) => {
  const router = express.Router();

  /* GET users listing. */
  router.get("/users", async (req, res) => {
    const cacheKey = "users";

    try {
      // Check if the data exists in the Redis cache
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
          // Fetch data from Supabase if not in cache
          console.log("Cache miss");
          const { data: users, error } = await supabase.auth.api.listUsers();

          if (error) {
            console.error("Supabase error:", error);
            return res.status(500).send({ message: "Error retrieving users" });
          }

          // Cache the result for 1 hour
          redisClient.setex(cacheKey, 3600, JSON.stringify(users));

          // Return the data to the client
          res.json(users);
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).send({ message: "Unexpected error occurred" });
    }
  });

  return router;
};
