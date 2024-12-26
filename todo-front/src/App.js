import React, {useState, useEffect} from 'react';

function App() {
  const [message, setMessage] = useState(''); 

  useEffect(()=>{
    //백엔드 api 호출
    fetch("http://localhost:5001/api/message")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error fetch message', error));
  }, [])

  return (
    <div>
      <h1>react와 express연결</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
