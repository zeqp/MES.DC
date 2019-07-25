/* eslint-disable no-undef */
import axiox from 'axios'
import $msg from "./msg"
const baseURL = process.env.VUE_APP_BaseUrl;
const appVerstion = process.env.VUE_APP_Version;
const service = axiox.create({
    baseURL: baseURL
});
service.interceptors.request.use(config => {
    config.headers["api-version"] = appVerstion;
    let tokenKey = process.env.VUE_APP_TokenKey;
    const token = localStorage.getItem(tokenKey);
    if (token) {
        config.headers["Authorization"] = 'Bearer ' + token;
    }
    return config;
}, error => {
    console.error('[ERROR] request created:\r\n' + JSON.stringify(error));
    $msg.show({
        message: error.message,
        type: "error",
        duration: 3000,
        showClose: true
    });
    Promise.reject(error);
});
service.interceptors.response.use(response => {
    let result = response.data;
    if (result.Code === "0") return result;
    $msg.show({
        message: result.message,
        type: "error",
        duration: 3000,
        showClose: true
    });
    return result;
}, error => {
    console.error('[ERROR] response created:\r\n' + JSON.stringify(error));
    $msg.show({
        message: error.message,
        type: "error",
        duration: 3000,
        showClose: true
    });
    Promise.reject(error);
});
export default service;