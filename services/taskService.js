
import { Tasks } from "../models/taskmodel.js";

// get all tasks

export const GetAllTasks = async (id) => {

    return new Promise((resolve, reject) => {
        Tasks.findAll({ where: { user_Id: id } }).then((data) => {
           //  console.log("usertasks=",data);
            resolve(data)
        }).catch((err) => {
           // console.log("finderror=", err);
            reject("failed")
        })
    })

}

//ceate a new task

export const CreateATask = async (title,desc,status,id) => {
    return new Promise((resolve, reject) => {
        Tasks.create({title:title,description:desc,status:status,user_Id:id}).then((data) => {
            //console.log("new task=", data);
            resolve("inserted")
        }).catch((err) => {
          //  console.log("finderror=", err);
            reject("failed")
        })
    })


}

//update task status

export const UpdateTaskStatus= async (status,id,user_Id) => {

    return new Promise((resolve, reject) => {
        Tasks.update({status:status }, { where: { task_Id:id,user_Id:user_Id} }).then((data) => {
            console.log("upadted data=", data);
             if (data[0]) {
                resolve("updated")
             } else {
                resolve("failed")
             }
            
        }).catch((err) => {
            reject("failed")
        })
    })

}
//delete unwanted tasks

export const DeleteTask=async(id,user_Id)=>{
    return new Promise((resolve, reject) => {
        Tasks.destroy({ where: { task_Id:id,user_Id:user_Id} }).then((data) => {
            console.log("delete data=", data);
            if (data) {
                resolve("deleted")
            } else {
                resolve("failed")
            }
           
        }).catch((err) => {
            reject("failed")
        })
    })
   
}
