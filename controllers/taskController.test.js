import { describe, expect, jest, test } from "@jest/globals";
import * as service from "../services/taskService"
import { getHome,postCreate ,getTask,statusUpdate,deleteATask} from "./taskController";

describe("Testing task controller.js",()=>{

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const allTask=[{
    task_Id:1,
      title:"test title",
      description: "test description",
      status:"pending",
      user_Id: 1,
    }]

test("@ /task/home - get all tasks -failed case 1",async()=>{
    const req={
        userId:1
    }
    const res={
        status:jest.fn(()=>res),
        json:jest.fn()
    }
    const GetAllTasks= jest.spyOn(service, "GetAllTasks").mockResolvedValue([]);
    await getHome(req,res)
    expect(GetAllTasks).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: false, response: "please create a new task" })

})

test("@ /task/home - get all tasks -failed case 2",async()=>{
    const req={
        userId:1
    }
    const res={
        status:jest.fn(()=>res),
        json:jest.fn()
    }
    const GetAllTasks= jest.spyOn(service, "GetAllTasks").mockResolvedValue(allTask);
    await getHome(req,res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ status: true, response: allTask })

})

test("@ /task/getTask/:id - get task -success case",async()=>{
    const req={
        params:{id:1}
    }
    const res={
        status:jest.fn(()=>res),
        json:jest.fn()
    }
    const GetTask= jest.spyOn(service, "GetTask").mockResolvedValue(allTask[0]);
    await getTask(req,res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ status: true, response: allTask[0] })

})

test("@ /task/getTask/:id - get task -failed case",async()=>{
    const req={
        params:{id:1}
    }
    const res={
        status:jest.fn(()=>res),
        json:jest.fn()
    }
    const GetTask= jest.spyOn(service, "GetTask").mockRejectedValue("failed");
    await getTask(req,res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: false, response: "please create a new task" })

})

test("@ /task/create - create a new task -success case",async()=>{
    const req={
        body:{
            title:"new title",
            description:"new test description"
        },
        userId:1
    }
    const res={
        status:jest.fn(()=>res),
        json:jest.fn()
    }
    const GetTask= jest.spyOn(service, "CreateATask").mockResolvedValue(true);
    await postCreate(req,res)
    expect(GetTask).toHaveBeenCalledWith(req.body.title,req.body.description,"pending",req.userId)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ status: true, response: true })

})
test("@ /task/create - create a new task -success case",async()=>{
    const req={
        body:{
            title:"new title",
            description:"new test description"
        },
        userId:1
    }
    const res={
        status:jest.fn(()=>res),
        json:jest.fn()
    }
    const GetTask= jest.spyOn(service, "CreateATask").mockRejectedValue(false);
    await postCreate(req,res)
    expect(GetTask).toHaveBeenCalledWith(req.body.title,req.body.description,"pending",req.userId)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: false, response: "failed to create new task"})

})

test("@ /task/statusUpdate- update status of the task -success case",async()=>{
    const req={
        body:{status:"completed"},
        query:{id:1},
        userId:1
    }
    const res={
        status:jest.fn(()=>res),
        json:jest.fn()
    }
    const Update= jest.spyOn(service, "UpdateTaskStatus").mockResolvedValue(true);
    await statusUpdate(req,res)
    expect(Update).toHaveBeenCalledWith(req.body.status,req.query.id,req.userId)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ status: true, response: "task status updated" })

})
test("@ /task/statusUpdate- update status of the task -failed case",async()=>{
    const req={
        body:{status:"completed"},
        query:{id:1},
        userId:1
    }
    const res={
        status:jest.fn(()=>res),
        json:jest.fn()
    }
    const Update= jest.spyOn(service, "UpdateTaskStatus").mockRejectedValue(false);
    await statusUpdate(req,res)
    expect(Update).toHaveBeenCalledWith(req.body.status,req.query.id,req.userId)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: false, response: "failed to update status" })

})

test("@ /task/statusUpdate- update status of the task -failed case",async()=>{
    const req={
        query:{id:1},
        userId:1
    }
    const res={
        status:jest.fn(()=>res),
        json:jest.fn()
    }
    const Delete= jest.spyOn(service, "DeleteTask").mockRejectedValue(false);
    await deleteATask(req,res)
    expect(Delete).toHaveBeenCalledWith(req.query.id,req.userId)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: false, response: "failed to delete task" })

})
test("@ /task/statusUpdate- update status of the task -success case",async()=>{
    const req={
        query:{id:1},
        userId:1
    }
    const res={
        status:jest.fn(()=>res),
        json:jest.fn()
    }
    const Delete= jest.spyOn(service, "DeleteTask").mockResolvedValue(true);
    await deleteATask(req,res)
    expect(Delete).toHaveBeenCalledWith(req.query.id,req.userId)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ status: true, response: "task deleted" })

})

})
