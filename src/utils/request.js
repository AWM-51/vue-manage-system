import axios from 'axios';

const service = axios.create({
    baseURL: "", // url = base url + request url
    timeout: 5000, // request timeout
    withCredentials: true, // send cookies when cross-domain requests 这里设置为true 就会自动携带cookie  他不是打开就能跨域,是打开的情况下跨域也能携带cookie,打开之后后台就不能使用*号来解决跨域了,要使用你当前ip来解决跨域,也就是说,开启携带凭证可能会导致跨域问题
    headers: {
    'Content-Type': 'application/json; charset=utf-8',
    }
});

service.interceptors.request.use(
    config => {
        config.headers.uid=localStorage.getItem('ms_uid');
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
