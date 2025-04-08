var express = require("express");
var router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = (redisClient) => {
  const router = express.Router();

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
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
          const {
            data: { user },
            error,
          } = await supabase.auth.signInWithPassword({
            email: email,
            password:  password,
          });

          if (error) {
            console.error("Supabase error:", error);
            return res.status(500).send({ message: "Incorrect email or password" });
          }
 
          // Cache the result for 1 hour
          redisClient.setex(cacheKey, 3600, JSON.stringify(data));

          res.cookie("jwt", user);
          res.send(user);
        }
      });
      
    } catch (error) {
      if (error?.response?.status === 401) {
        console.error("Incorrect email or password");
      } else {
        console.error(error);
      }
    }
  
    // Use the auth.sign_in method to log the user in and retrieve a JWT
  });

  return router;
}

/* Post login . */



