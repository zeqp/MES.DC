import service from "../common/request"
let api = {
    getModel(id) {
        return service.get("/api/Task/GetTask?id=" + id);
    },
    getTask(model) {
        return service.post("/api/Task/GetTask", model);
    },
    getBom(model) {
        return service.post("/api/Task/GetBom", model);
    },
    taskStart(model) {
        return service.post("/api/Task/TaskStart", model);
    },
    taskSuccess(model) {
        return service.post("/api/Task/TaskSuccess", model);
    },
    getStopType() {
        return service.get("/api/Task/GetStopType");
    },
    taskStop(model) {
        return service.post("/api/Task/TaskStop", model);
    }
};
export default api;