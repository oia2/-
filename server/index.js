require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const client = require('./Client');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(errorMiddleware);
app.use('/static', express.static('public'));


const start = async () => {
    try {
        await client.connect()
        app.listen(PORT, () => console.log(`Server started om PORT = ${PORT}`))
    }  catch (e) {
        console.log(e);
    }
}

start()