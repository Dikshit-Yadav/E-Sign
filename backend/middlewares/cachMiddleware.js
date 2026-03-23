const redis = require("../redisClient");

const cache = (key) => {
   return async (req, res, next)=>{
        try {
            const cacheData = await redis.get(key);
            if (cacheData) {
                console.log("from cache");
                (cacheData)
                return res.send(JSON.parse(cacheData));
            }
            console.log("redis miss");
            next();

        } catch (err) {
            console.log("redis error",err.message);
            next();
        }
    };
};

module.exports = cache;