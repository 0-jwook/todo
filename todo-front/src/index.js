import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18에서는 'react-dom/client'를 사용
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // createRoot 사용
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
