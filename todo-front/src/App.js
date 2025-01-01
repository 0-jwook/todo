import React, {useState, useEffect} from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]); //서버에서 가져온 메시지
  const [editIndex ,setEditIndex] = useState(null); // 수정중인 메시지의 인덱스
  const [editText, setEditText] = useState(''); // 수정중인 메시지의 텍스트
  const [editPriority, setEditpriority] = useState(''); // 수정중인 메시지의 텍스트
  const [priority, setPriority] = useState('Low'); // 우선순위 기본값

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    fetch('http://localhost:5001/api/messages')
      .then((response) => response.json())
      .then((data) => setMessages(data.messages || []))
      .catch((error) => console.error('Error fetching messages: ', error));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5001/api/send', {
      method : 'POST', 
      headers: {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({text : inputText, priority}),
    })
      .then(() => {
        fetch('http://localhost:5001/api/messages')
          .then((response) => response.json())
          .then((data) => setMessages(data.messages));
        setInputText('');
        setPriority('Low');
      })
      .catch((error) => console.error('error sending data : ', error));
  };

  const handleDelte = (index) => {
    fetch(`http://localhost:5001/api/messages/${index}`, {
      method : 'DELETE', 
    })
    .then(() => fetchMessages())
    .catch((error) => console.error('Error deleting message: ', error));
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditText(messages[index].text);
    setEditpriority(messages[index].priority)
  }

  const handlesave = () => {
    fetch(`http://localhost:5001/api/messages/${editIndex}`, {
      method :'PUT',
      headers: {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({text : editText, priority : editPriority}),
    })
    .then(() => {
      fetchMessages();
      setEditIndex(null);
      setEditText('');
      setEditpriority('');
    })
    .catch((error) => console.error('Error updating message: ', error));
  }
  

  return (
    <div>
      <h1>React 와 express 데이터 전송</h1>
      <form onSubmit = {handleSubmit}>
        <input type='text' value={inputText} onChange={(e)=> setInputText(e.target.value)} placeholder='텍스트 입력'/>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Middle">Middle</option>
          <option value="Low">Low</option>
        </select>
        <button type='submit'>전송</button>
      </form>
      <h2>메시지 목록</h2>
      <ol>
        {messages.map((msg, index) => (
          <li key={index}>
            {editIndex === index ? (
              <div>
                <input type='text' value={editText} onChange={(e) => setEditText(e.target.value)}/>
                <select value={editPriority} onChange={(e) => setEditpriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Middle">Middle</option>
                  <option value="Low">Low</option>
              </select>
                <button onClick={handlesave}>저장</button>
                <button onClick={() => setEditIndex(null)}>취소</button>
              </div>
            ) : (
              <div>
                {msg.text}({msg.priority})
                <button onClick={() => handleEdit(index)}> 수정 </button>
                <button onClick={() => handleDelte(index)}> 삭제 </button>
              </div>
            )}
            </li>
          ))}
      </ol>
    </div>
  );
}

export default App;
