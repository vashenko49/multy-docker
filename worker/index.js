const keys = require('./keys');
const Redis = require('ioredis');

const redis = new Redis({
    host: keys.redisHost,
    port: keys.redisPort
})

const dup = redis.duplicate()

redis.hgetall('value', (data) => {
    console.log(data);
})

function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

redis.subscribe("value", (err, count) => {
    if (err) console.error(err.message);
    console.log(`Subscribed to ${count} channels.`);
});

redis.on("message", (channel, message) => {
    console.log(`Received message from ${channel} channel.`);
    const {index} = JSON.parse(message);

    dup.hset('values', index, fib(parseInt(index)));
});
console.log('worker')
