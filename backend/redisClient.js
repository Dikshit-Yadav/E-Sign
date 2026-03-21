const {createClient} = require('redis');

const redis = createClient()

redis.connect()

redis.on("connect",()=>{
    console.log("redis is connected");
})

redis.on("error",(err)=>{
    console.log(err.message);
})

module.exports = redis;