import React, { useContext, useEffect } from 'react';
import './styles/App.css';
import Menu from './components/Menu';
import CenterBlock from './components/CenterBlock/CenterBlock';
import Navbar from './components/Navbar/Navbar';
import Playlists from './components/Playlists/Playlists';
import Login from './pages/login/login';
import { Context } from './main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './pages/mainPage';
import {observer} from "mobx-react-lite";
import Registration from './pages/registration/registration';

function App() { 
  const {store} = useContext(Context);
  
  useEffect (() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/registration" element={<Registration />}/>
        <Route path="*" element={<MainPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default observer(App);
