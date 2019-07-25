import service from "../common/request"
let loginSvc={
    getToken(model){
        return service.post("/api/Login/Token",model);
    },
    getUser(){
        return service.get("/api/Login/GetUser")
    }
}
export default loginSvc;