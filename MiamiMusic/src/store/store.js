import { createContext } from 'react';
import ReactDOM from 'react-dom';
import React from 'react';
import AuthService from "../services/AuthService";
import axios from 'axios';
import { makeAutoObservable } from 'mobx';


class Store {
    isAuth = false;
    user = {};
    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setUser(user) {
        this.user = user;
    }

    async login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            return null; // В случае успеха возвращаем null
        } catch (e) {
            console.log(e.response?.data?.message);
            return e.response?.data?.message; // Возвращаем сообщение об ошибке
        }
    }

    async registration(email, password) {
        try {
            const response = await AuthService.registration(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            return null; // В случае успеха возвращаем null
        } catch (e) {
            // Логирование для отладки
            console.error(e.response?.data?.message);
            // Возврат сообщения об ошибке для отображения в компоненте
            return e.response?.data?.message || "Произошла ошибка при регистрации.";
        }
    }
    
    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({});
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        try {
            console.log(1);
            const response = await AuthService.refresh();
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            
        } catch (e) {
            console.log(e.response?.data?.message)
        }
    }
}

export default Store;
