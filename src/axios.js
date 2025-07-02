import axios from 'axios';
import store from './store';

axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';

axios.interceptors.request.use(
  (config) => {
    if(!navigator.onLine) {
      store.state.online = false;
      return Promise.reject(new Error('You are offline.'));
    }
    store.state.is_loading = true
    const token = store.state.user?.access
    token && (config.headers.Authorization = `Bearer ${token}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
);
axios.interceptors.response.use(
  (response) => {
    store.state.is_loading = false
    return response
  },
  (error) => {
    store.state.is_loading = false
    return Promise.reject(error)
  }
);
export default axios;