import axios from 'axios';
import qs from 'qs';

const http = axios.create({
    baseURL: 'https://littlebee.jc-cdm.com/app/shop/',
    method: 'GET',
});

http.interceptors.request.use((config) => {
    if (['POST', 'PUT'].includes(config.method!.toUpperCase())) {
        console.log(config.headers);

        config.data = qs.stringify(config.data);
        config.headers = Object.assign(config.headers, {
            'content-type': 'application/x-www-form-urlencoded',
        });
    }
    return config;
});

http.interceptors.response.use((response) => {
    console.log('拦截器');
    console.log(response.data);
    return response;
});

export default http;
