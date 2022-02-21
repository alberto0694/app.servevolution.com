

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';

//axios.defaults.baseURL = 'https://api-servevolution-com.herokuapp.com';
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.interceptors.request.use((config) => {
    console.log('passei aqui no axios: ', config);
    return config;
  });

const app = ( 

    <App/>
    
);

ReactDOM.render(app, document.getElementById('root') );