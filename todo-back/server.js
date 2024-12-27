const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5001;

//데이터 저장용 배열
const messages = [];

app.use(cors());
app.use(express.json());

//POST 요청으로 데이터 저장
app.post('/api/send', (req, res)=>{
    const {text} = req.body;
    console.log("Received text from React : ", text);
    messages.push(text); // 배열에 데이터 저장
    res.json({messages : messages})
});

//GET 요청으로 데이터 변환
app.get('/api/messages', (req, res) => {
    res.json({ messages : messages}); //저장된 데이터 반환
});

app.listen(PORT, ()=>{
    console.log(`Sever is running on http://localhost:${PORT}`);
});


