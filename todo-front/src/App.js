import React, { useState, useEffect } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]); // 서버에서 가져온 메시지
  const [editId, setEditId] = useState(null); // 수정 중인 메시지의 인덱스
  const [editText, setEditText] = useState(''); // 수정 중인 메시지의 텍스트
  const [editPriority, setEditPriority] = useState(''); // 수정 중인 메시지의 우선순위
  const [priority, setPriority] = useState('Low'); // 우선순위 기본값
  const [filterOption, setFilterOption] = useState('all'); // 필터 기준

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    fetch('http://localhost:5001/api/messages')
      .then((response) => response.json())
      .then((data) => setMessages(data.data || []))
      .catch((error) => console.error('Error fetching messages: ', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5001/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: inputText, priority }),
    })
      .then(() => {
        fetchMessages();
        setInputText('');
        setPriority('Low');
      })
      .catch((error) => console.error('Error sending data: ', error));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5001/api/messages/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchMessages())
      .catch((error) => console.error('Error deleting message: ', error));
  };

  const handleEdit = (id) => {
    setEditId(id);
    setEditText(messages[id].text);
    setEditPriority(messages[id].priority);
  };

  const handleSave = () => {
    fetch(`http://localhost:5001/api/messages/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: editText, priority: editPriority }),
    })
      .then(() => {
        fetchMessages();
        setEditId(null);
        setEditText('');
        setEditPriority('');
      })
      .catch((error) => console.error('Error updating message: ', error));
  };

  const handleToggleComplete = (id) => {
    fetch(`http://localhost:5001/api/messages/complete/${id}`, {
      method: 'PUT',
    })
      .then(() => fetchMessages())
      .catch((error) => console.error('Error toggling complete status: ', error));
  };

  const filteredMessages = messages.filter((msg) => {
    if (filterOption === 'completed') return msg.isCompleted;
    if (filterOption === 'incomplete') return !msg.isCompleted;
    return true; // "all"일 경우 모든 메시지 표시
  });

  return (
    <div>
      <h1>React 와 Express 데이터 전송</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="텍스트 입력"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Middle">Middle</option>
          <option value="Low">Low</option>
        </select>
        <button type="submit">전송</button>
      </form>

      <h2>필터링 옵션</h2>
      <div>
        <label>
          <input
            type="radio"
            value="all"
            checked={filterOption === 'all'}
            onChange={() => setFilterOption('all')}
          />
          모두 보기
        </label>
        <label>
          <input
            type="radio"
            value="completed"
            checked={filterOption === 'completed'}
            onChange={() => setFilterOption('completed')}
          />
          완료됨
        </label>
        <label>
          <input
            type="radio"
            value="incomplete"
            checked={filterOption === 'incomplete'}
            onChange={() => setFilterOption('incomplete')}
          />
          미완료
        </label>
      </div>

      <h2>메시지 목록</h2>
      <ol>
        {filteredMessages.map((msg) => (
          <li key={msg.id} style={{ textDecoration: msg.isCompleted ? 'line-through' : 'none' }}>
            <input
              type="checkbox"
              checked={msg.isCompleted}
              onChange={() => handleToggleComplete(msg.id)}
            />
            {editId === msg.id ? (
              <div>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Middle">Middle</option>
                  <option value="Low">Low</option>
                </select>
                <button onClick={handleSave}>저장</button>
                <button onClick={() => setEditId(null)}>취소</button>
              </div>
            ) : (
              <div>
                {msg.text} ({msg.priority})
                <button onClick={() => handleEdit(msg.id)}>수정</button>
                <button onClick={() => handleDelete(msg.id)}>삭제</button>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
