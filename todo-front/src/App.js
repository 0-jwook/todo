import React, { useState, useEffect } from 'react'; // useState, useEffect사용을 위한 코드
import styled from "styled-components"; // 스타일드 컴넌트 적용

const Title = styled.h1`color : ${props => props.color || `black`};`;
const List = styled.li`display : flex`;

function App() {
  const [inputText, setInputText] = useState(''); // 입력된 메시지
  const [messages, setMessages] = useState([]); // 서버에서 가져온 메시지
  const [editId, setEditId] = useState(null); // 수정 중인 메시지의 인덱스
  const [editText, setEditText] = useState(''); // 수정 중인 메시지의 텍스트
  const [editPriority, setEditPriority] = useState(''); // 수정 중인 메시지의 우선순위
  const [priority, setPriority] = useState('Low'); // 우선순위 기본값
  const [filterOption, setFilterOption] = useState('all'); // 필터 기준

  useEffect(() => { // 새로고침 될떄 실행
    fetchMessages();
  }, []);

  const fetchMessages = () => { // 백엔드에 요청을 보내 message 라는 useState 에 저장
    fetch('http://localhost:5001/api/messages')
      .then((response) => response.json()) // 백엔드에서 응답을 받아와
      .then((data) => setMessages(data.data || [])) // message에 저장
      .catch((error) => console.error('Error fetching messages: ', error)); // 오류
  };

  const handleSubmit = (e) => { // 벡엔드에 전송하는 코드
    e.preventDefault();
    fetch('http://localhost:5001/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: inputText, priority }), // 이러한 형식으로 전달함
    })
      .then(() => {
        fetchMessages(); // messages 서버에서 가져오기
        setInputText(''); // 입력한 텍스트 값 초기화
        setPriority('Low'); // 설정한 우선순위값 초기화
      })
      .catch((error) => console.error('Error sending data: ', error)); // 오류
  };

  const handleDelete = (id) => { // 벡엔드에 id 값을 가진 것을 삭제를 요청하는 코드
    fetch(`http://localhost:5001/api/messages/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchMessages()) // messages 서버에서 가져오기
      .catch((error) => console.error('Error deleting message: ', error)); // 오류
  };

  const handleEdit = (id) => { // 수정하는 코드
    const messageToEdit = messages.find((msg) => msg.id === id); // messags 배열 안에 매개변수로 받은 id값과 같은 id를 가진 데이터가 있으면 messageToEdit에 저장
    if (messageToEdit){ // messageToEdit에 저장되면 
      setEditId(id); // 수정해야할 id값을 저장하는 변수에 매개변수로 받은 id 값 저장
      setEditText(messageToEdit.text); // 수정해야할 id값을 가진 message데이터에서 text 추출
      setEditPriority(messageToEdit.priority); // 수정해야할 id값을 가진 message데이터에서 priority 추출
    }else{ // 아니면
      console.error("Message not found"); // 오류
    }
    
  };

  const handleSave = () => { // 수정한 값을 백엔드로 보내 저장하는 코드
    fetch(`http://localhost:5001/api/messages/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: editText, priority: editPriority }), // 이러한 형식으로 전달함
    })
      .then(() => {
        fetchMessages(); // messages 서버에서 가져오기
        setEditId(null); // 수정이 끝났으니 수정해야할 id 초기화
        setEditText(''); // 수정할 텍스트 값 초기화
        setEditPriority(''); // 수정할 우선순위값 초기화
      })
      .catch((error) => console.error('Error updating message: ', error)); // 오류
  };

  const handleToggleComplete = (id) => {
    fetch(`http://localhost:5001/api/messages/complete/${id}`, {
      method: 'PUT',
    })
      .then(() => fetchMessages()) // messages 서버에서 가져오기
      .catch((error) => console.error('Error toggling complete status: ', error)); // 오류
  };

  const filteredMessages = messages.filter((msg) => {
    if (filterOption === 'completed') return msg.isCompleted;
    if (filterOption === 'incomplete') return !msg.isCompleted;
    return true; // "all"일 경우 모든 메시지 표시
  });

  return (
    <div>
      <Title color='red'>React 와 Express 데이터 전송</Title>
      <Title color='blue'>todoList</Title>
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
          <List key={msg.id} style={{ textDecoration: msg.isCompleted ? 'line-through' : 'none' }}>
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
          </List>
        ))}
      </ol>
    </div>
  );
}

export default App;
