// import store from '@/store';
import axios from 'axios';
import util from '@/libs/util';
import Setting from '@/setting';
import qs from 'qs';
import router from '../../router';
import { Modal, Message, Notice } from 'view-design';

// 创建一个错误
function errorCreate (msg) {
    const err = new Error(msg);
    errorLog(err);
    throw err;
}

// 记录和显示错误
function errorLog (err) {
    // 添加到日志
    // store.dispatch('admin/log/push', {
    //     message: '数据请求异常',
    //     type: 'error',
    //     meta: {
    //         error: err
    //     }
    // });

    // 打印到控制台
    if (process.env.NODE_ENV === 'development') {
        util.log.error('>>>>>> Error >>>>>>');
    }
    // 显示提示，可配置使用 iView 的 $Message 还是 $Notice 组件来显示
    if (Setting.errorModalType === 'Message') {
        Message.error({
            content: err.message,
            duration: Setting.modalDuration
        });
    } else if (Setting.errorModalType === 'Notice') {
        Notice.error({
            title: '提示',
            desc: err.message,
            duration: Setting.modalDuration
        });
    }
}

// 创建一个 axios 实例
const service = axios.create({
    baseURL: Setting.apiBaseURL,
    timeout: 5000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(

    config => {
        // 在请求发送之前做一些处理
        const token = sessionStorage.getItem('token');
        // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        config.headers['X-Token'] = token;
        return config;
    },
    error => {
        // 发送失败

        Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        // dataAxios 是 axios 返回数据中的 data
        const dataAxios = response.data;
        // 这个状态码是和后端约定的
        const { code } = dataAxios;
        // 根据 code 进行判断
        if (code === undefined) {
            // 如果没有 code 代表这不是项目后端开发的接口
            return dataAxios;
        } else {
            // 有 code 代表这是一个后端接口 可以进行进一步的判断
            if (code === '0') {
                return dataAxios;
            } else if (code === '1') {
                return dataAxios;
                // return errorCreate(dataAxios.message);
            } else if (code === '-1') {
                Modal.confirm({
                    content: '登录状态过期了，请重新登录',
                    onOk: () => {
                        router.push({ name: 'login' }) // 只能用 name
                    }
                })
            } else {
                errorCreate(`未知错误(code:${code})`);
            }
            // switch (code) {
            // case '0':
            //     // code === 0 代表没有错误
            //     return dataAxios;
            // case '1':
            //     errorCreate(dataAxios.message);
            //     break;
            // case '-1':

            //     errorCreate('登录状态过期了，请重新登录！');
            //     break;
            // default:
            //     errorCreate(`未知错误(code:${code})`);
            //     break;
            // }
        }
    },
    error => {
        if (error && error.response) {
            switch (error.response.status) {
            case 400: error.message = '请求错误'; break;
            case 401: error.message = '未授权，请登录'; break;
            case 403: error.message = '拒绝访问'; break;
            case 404: error.message = `请求地址出错: ${error.response.config.url}`; break;
            case 408: error.message = '请求超时'; break;
            case 500: error.message = '服务器内部错误'; break;
            case 501: error.message = '服务未实现'; break;
            case 502: error.message = '网关错误'; break;
            case 503: error.message = '服务不可用'; break;
            case 504: error.message = '网关超时'; break;
            case 505: error.message = 'HTTP版本不受支持'; break;
            default: break;
            }
        }
        errorLog(error);
        return Promise.reject(error);
    }
);

const GET = (url, params) => {
    return service({
        url,
        method: 'get',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        params
    });
};

const POST = (url, params) => {
    return service({
        url: `${url}?v=` + new Date().getTime(),
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        },
        data: qs.stringify(params)
    });
};
const POSTS = (url, params) => {
    return service({
        url: `${url}?v=` + new Date().getTime(),
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        data: params
    });
};
const JPOST = (url, params) => {
    return service({
        url: `${url}`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        data: params
    });
};
export const FETCH = (url, params) => {
    return axios.get(`${url}`, { params: params }).then(res => res)
}

export default {
    GET,
    POST,
    JPOST,
    POSTS,
    FETCH
};
