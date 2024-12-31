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

app.delete('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    const index = parseInt(id, 10);
    if (index >= 0 && index < messages.length){
        messages.splice(index, 1);
        res.json({success : true})
    }else{
        res.status(400).json({success : false, message : "Invalid ID"});
    }
});

app.put('/api/messages/:id', (req, res) => {
    const { id } = req.params; // URL에서 id 추출
    const { text } = req.body; // 요청 바디에서 수정할 텍스트 추출
    const index = parseInt(id, 10); // 문자열을 숫자로 변환

    if (index >= 0 && index<messages.length){
        messages[index] = text;// 배열 데이터 수정
        res.json({success : true, messages});// 성공 시 업데이트된 데이터 반환
    }else{
        res.status(400).json({ success: false, message: "Invalid ID" }); // 실패 시 에러 메시지
    }
    
})

app.listen(PORT, ()=>{
    console.log(`Sever is running on http://localhost:${PORT}`);
});


