import './App.css';
import React from 'react'
import ChatsPage from './pages/ChatsPage'
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import HomePage from './components/HomePage.jsx';



const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={HomePage} exact/>
        <Route path="/chats" Component={ChatsPage}/>
        <Route path="/register" element={<SignUp/>} exact />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </div>
    
  )
}

export default App