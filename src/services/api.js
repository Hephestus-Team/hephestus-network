/* eslint-disable no-param-reassign */
import axios from 'axios';

const user = localStorage.getItem('persist:hephestus-network')
  ? JSON.parse(JSON.parse(localStorage.getItem('persist:hephestus-network')).user)
  : {
    token: '',
    uniqid: '',
  };

const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: user.token,
    u: user.uniqid,
  },
});

export default api;
