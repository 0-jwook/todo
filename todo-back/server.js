const express = require("express");
const cors = require("cors");
const db = require("./db")

const app = express();
const PORT = 5001;


app.use(cors());
app.use(express.json());

// POST 요청으로 데이터 저장
app.post('/api/send',  async(req, res) => {
    const { text, priority } = req.body;
    const query = "INSERT INTO messages (text, priority, isCompleted) VALUES (?, ?, ?)";
    try{
        await db.query(query, [text, priority, false],)
        res.json({success : true});
    }catch(err){
        console.error("Error inserting data : ", err);
        res.status(500).json({success : false, message : "Error inserting data"});
    }
});

// GET 요청으로 데이터 반환
app.get('/api/messages', async(req, res) => {
    const query = "SELECT * FROM messages ORDER BY priority";
    try{
        const [results] = await db.query(query)
        res.json({success : true, data : results});
    }catch(err){
        console.error("Error fetching data : ", err);
        res.status(500).json({success : false, message : "Error fetching data"});
    }
});

// DELETE 요청으로 데이터 삭제
app.delete('/api/messages/:id', async(req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM messages WHERE id = ?";
    try{
        await db.query(query, [id]);
        res.json({success : true});
    }catch{
        console.error("Error deleting data : ", err);
        res.status(500).json({success : false, message : "Error deleting data"});
    }
}); 

// PUT 요청으로 데이터 수정
app.put('/api/messages/:id', async(req, res) => {
    const { id } = req.params; // URL에서 id 추출
    const { text, priority } = req.body; // 요청 바디에서 수정할 텍스트 추출
    const query = "UPDATE messages SET text = ?, priority = ? WHERE id = ?";
    try{
        await db.query(query ,[text, priority, id])
        res.json({success : true});
    }catch{
        console.error("Error updating data : ", err);
        res.status(500).json({success : false, message : "Error updating data"});
    }
});

// PUT 요청으로 완료 여부 변경
app.put('/api/messages/complete/:id', async(req, res) => {
    const { id } = req.params;
    const query = "UPDATE messages SET isCompleted = NOT isCompleted WHERE id = ?";
    try{
        await db.query(query, [id])
        res.json({success : true});
    }catch{
        console.error("Error updating compltetion status : ", err);
        res.status(500).json({success : false, message : "Error updating compltetion status"});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
