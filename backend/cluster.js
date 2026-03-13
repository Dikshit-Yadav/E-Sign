const cluster = require("cluster");
const os = require("os");
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary process ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        console.log("Starting new worker...");
        cluster.fork();
    });
} else {
    require("./server");
    console.log(`Worker ${process.pid} started`);
}