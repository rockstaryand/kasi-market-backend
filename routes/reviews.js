// var express = require("express");
// var router = express.Router();
// const { createClient } = require("@supabase/supabase-js");
// const dotenv = require("dotenv");

// dotenv.config();

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// module.exports = (redisClient) => {
//     const router = express.Router();

//     router.get('/products/:id/reviews', async (req, res) => {
//         const cacheKey = 'reviewsCache';

//         // Try to get data from Redis cache
//         const cachedReviews = await redisClient.get(cacheKey);
//         if (cachedReviews) {
//             console.log('Serving from cache');
//             return res.json(JSON.parse(cachedReviews)); // Return cached data
//         }

//         // Fetch reviews from Supabase if cache is empty
//         try {
//             const { data: reviews, error } = await supabase
//                 .from('Reviews')
//                 .select('*');

//             if (error) throw error;

//             // Cache the fetched reviews in Redis for future requests
//             await redisClient.setEx(cacheKey, 60 * 60, JSON.stringify(reviews)); // Cache for 1 hour
//             res.json(reviews);
//         } catch (error) {
//             console.error('Error fetching reviews:', error);
//             res.status(500).send('Error fetching reviews');
//         }
//     });

//     router.post('/reviews', async (req, res) => {
//         const { rating, body, product_id, user_id } = req.body;
      
//         try {
//           // Insert the review into Supabase
//           const { data, error } = await supabase
//             .from('Reviews')
//             .insert([
//               { rating, body, product_id, user_id },
//             ])
//             .select();
      
//           if (error) throw error;
      
//           // Clear the cache to refresh the reviews
//           await redisClient.del('reviewsCache');
      
//           res.status(201).json(data); // Return the newly created review
//         } catch (error) {
//           console.error('Error inserting review:', error);
//           res.status(500).send('Error adding review');
//         }
//       });
// }