import React, {useState, useEffect} from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]); //서버에서 가져온 메시지


  useEffect(() => {
    fetch('http://localhost:5001/api/messages')
      .then((response) => response.json())
      .then((data) => setMessages(data.messages))
      .catch((error) => console.error('Error fetching messages : ', error));
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5001/api/send', {
      method : 'POST', 
      headers: {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({text : inputText}),
    })
      .then(() => {
        fetch('http://localhost:5001/api/messages')
          .then((response) => response.json())
          .then((data) => setMessages(data.messages));
        setInputText('');
      })
      .catch((error) => console.error('error sending data : ', error));
  };
  

  return (
    <div>
      <h1>React 와 express 데이터 전송</h1>
      <form onSubmit = {handleSubmit}>
        <input type='text' value={inputText} onChange={(e)=> setInputText(e.target.value)} placeholder='텍스트 입력'/>
        <button type='submit'>전송</button>
      </form>
      <h2>메시지 목록</h2>
      <ol>
        {messages.map((msg, index) => (<li key={index}>{msg}</li>))}
      </ol>
    </div>
  );
}

export default App;
