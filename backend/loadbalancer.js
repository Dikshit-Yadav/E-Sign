require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const servers = [
    `http://localhost:${process.env.PORT ||4500}`,
    `http://localhost:${process.env.PORT2 ||4502}`,
    `http://localhost:${process.env.PORT3 || 4503}`
];

let current = 0;

app.use(async (req, res) => {
    const { method, url, headers, body } = req;

    let targetServer;

    if (url.startsWith('/auth') || url.startsWith('/users') || url.startsWith('/admin')) {
        targetServer = `http://localhost:${process.env.PORT}`
    } else if (url.startsWith('/documents')) {
        targetServer = `http://localhost:${process.env.PORT2}`
    } else if (url.startsWith('/officer')) {
        targetServer = `http://localhost:${process.env.PORT3}`
    } else {
        targetServer = servers[current];
        current = (current + 1) % servers.length;
    }

    console.log(`Forwarding ${method} ${url} → ${targetServer}`);

    try {
        const response = await axios({
            url: `${targetServer}${url}`,
            method,
            headers: { ...headers, host: undefined },
            data: body,
            validateStatus: () => true
        });

        res.status(response.status).set(response.headers).send(response.data);
    } catch (err) {
        console.error(`Error forwarding to ${targetServer}:`, err.message);
        res.status(500).send("Server error!");
    }
})





app.listen(8080, () => {
    console.log("http://localhost:8080");
    
});
