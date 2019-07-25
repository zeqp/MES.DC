import { Message } from "element-ui"
const $msg = {};
let toastInstance = null;
$msg.show = (option) => {
    if (!option) option = {};
    const { message, duration, type } = option;
    toastInstance = Message({
        message: message || '',
        duration: duration || 3000,
        type: type || 'info',
        offset: 5
    });
}
$msg.close = () => {
    toastInstance.close();
}
export default $msg;
