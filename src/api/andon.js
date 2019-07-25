import service from "../common/request"
let api = {
    getCurTask() {
        return service.get("/api/Andon/GetCurTask");
    },
    getTaskUser(taskId) {
        return service.get("/api/Andon/GetTaskUser?taskId=" + taskId);
    },
    getAndon(model) {
        return service.post("/api/Andon/GetAndon", model);
    },
    start(model){
        return service.post("/api/Andon/Start",model);
    },
    confirm(model){
        return service.post("/api/Andon/Confirm",model);
    },
    process(model){
        return service.post("/api/Andon/Process",model);
    },
    done(model){
        return service.post("/api/Andon/Done",model);
    },
    getHis(model){
        return service.post("/api/Andon/GetHis", model);
    }
};
export default api;