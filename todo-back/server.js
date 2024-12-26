const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.send("sever is running!");
});

app.listen(PORT, ()=>{
    console.log('Sever is running on http//:localhost:${PORT}');
});

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});
