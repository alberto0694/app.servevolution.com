import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import ptMessages from "devextreme/localization/messages/pt.json";
import { locale, loadMessages } from "devextreme/localization";
import config from "devextreme/core/config";
import { NotificationManager } from 'react-notifications';

import './index.css';

//axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.baseURL = 'https://api-servevolution-com.herokuapp.com';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.interceptors.request.use((config) => {

    if (config.url != '/api/auth/login') {
        let usuarioStr = localStorage.getItem("usuarioCache");
        let usuarioCache = usuarioStr ? JSON.parse(usuarioStr) : null;
        config.headers.Authorization = usuarioCache ? `${usuarioCache.token_type} ${usuarioCache.access_token}` : null;
    }

    return config;

});

axios.interceptors.response.use((response) => {

    return response;

}, (error) => {
    if (error.response.status === 401) {
        localStorage.removeItem("usuarioCache");
        window.location.pathname = '/';
        NotificationManager.error('Token de acesso expirado.', 'Acesso');
    }

    console.log(error);
    if (error.response.status === 403) {
        NotificationManager.error(error.response.data.message, 'Acesso');
    }

    return error;
});

config({
    defaultCurrency: 'BRL',
    serverDecimalSeparator: '.',
    thousandsSeparator: '.',
    decimalSeparator: ','
});

loadMessages(ptMessages);
locale(navigator.language);

const app = (

    <App />

);

ReactDOM.render(app, document.getElementById('root'));