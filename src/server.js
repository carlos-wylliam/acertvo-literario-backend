require("dotenv").config();
const connectDB = require('./config/database');
const {app} = require("./app");

const port = process.env.port || 3000;
app.listen(port)


connectDB();


