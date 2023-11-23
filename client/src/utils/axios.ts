import axios from 'axios';
import { getCookie, clearCookie } from './cookies';
import { toast } from 'react-toastify';

export const instance = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Request interceptor
instance.interceptors.request.use(
  async (config) => {
    const token = getCookie('access_token');

    if (token) {
     config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(token, 'token');
    return config;
  },
  
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response.data.status === 'fail jwt') {
      clearCookie('access_token');

      setTimeout(() => {
        window.location.href = '/auth';
      }, 3000);
    }

    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

// const AxiosWrapper = () => {
//   const { access_token } = cookies;

//   useEffect(() => {
//     // Update the Authorization header whenever the token changes
//     if (access_token) {
//       instance.defaults.headers.common[
//         'Authorization'
//       ] = `Bearer ${access_token}`;
//     }
//   }, [access_token]);

//   return null; // This component doesn't render anything
// };

// export { instance, AxiosWrapper };

/* 

  import axios from 'axios';
// config
import { HOST_API } from '../config';
// utils
import { getCookie, clearCookie } from './cookies';
import snackbar from './snackbar';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getCookie('nairabox_accessToken');
    const locale = localStorage.getItem('i18nextLng');
    const deviceId = localStorage.getItem('deviceId');

    if (deviceId) {
      config.headers['X-Request-Device-Id'] = deviceId.replace(/"/g, '');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['Accept-Language'] = locale !== null ? `en-${locale.toUpperCase()}` : 'en-NG';

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      snackbar.error('Unauthorized, Logging Out!');

      clearCookie('nairabox_accessToken');

      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 3000);
    }

    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

export default axiosInstance;

*/
