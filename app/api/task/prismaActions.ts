'use server';

import prisma from "@/app/libs/prismadb";
import { Family, Task, TaskStatus } from "@prisma/client";
import { updateTotalTimeOutsidePet } from "../pet/prismaActions";

 const parseDate = (date: string | Date): Date => {
    if (typeof date === "string") {
      return new Date(date);
    } else {
      return date;
    }
  };


export async function deleteTask(taskToDelete: any){

    // console.log(`deleteTask ${JSON.stringify(taskToDelete)}`)

    // return


    console.log(`task to delete id ${taskToDelete._id}`)
    const task = await prisma.task.findUnique({
        where: { id: taskToDelete._id },
    });

    // console.log(task)
    // return

    if (!task) {
        throw new Error(`Task with id ${taskToDelete._id} not found.`);
    }
    
    if (task.petId != taskToDelete.petId) {
         throw new Error(`Pet ids are not the same for that task id`);
    }
    
    const pet = await prisma.pet.findUnique({
        where: {id: task.petId}
    })

    if (!pet){
         throw new Error(`Pet with id ${task.petId} not found.`);
    }

    
    await prisma.pet.update({
        where: { id: taskToDelete.petId},
        data: {
            taskIds: {
                set: pet.taskIds.filter((id) => id !== taskToDelete._id),
            },
        },
    });

    await prisma.task.delete({
        where: { id: taskToDelete._id },
    });


}

export async function updateTaskStatus(task: any, status: TaskStatus){
    console.log(`cancelTask ${JSON.stringify(task)}`)

    const selectedTask = await prisma.task.findUnique({
        where: {id: task._id}
    })

    if (!selectedTask){
          throw new Error(`Family with id ${task._id} does not exist.`);
    } 

    await prisma.task.update({
        where: {id: task._id},
        data: {
            status: {
                set: status
            }
        }
    })

}

export async function updateTaskTimeSpentOutside(task: any, timeSpentOutside: number){

    const selectedTask = await prisma.task.findUnique({
        where: {id: task._id}
    })

    if (!selectedTask){
          throw new Error(`Family with id ${task._id} does not exist.`);
    } 

    await prisma.task.update({
        where: {id: task._id},
        data: {
            timeSpentOutside: {
                set: timeSpentOutside
            }
        }
    })

    await updateTotalTimeOutsidePet(task.petId, timeSpentOutside);
    

}

export async function updateTaskPhoto(task: any, url: string){
    console.log(`cancelTask ${JSON.stringify(task)}`)

    const selectedTask = await prisma.task.findUnique({
        where: {id: task._id}
    })

    if (!selectedTask){
          throw new Error(`Family with id ${task._id} does not exist.`);
    } 

    await prisma.task.update({
        where: {id: task._id},
        data: {
            image: {
                set: url
            }
        }
    })

}




export async function createTask(petId: string, familyId:string, userId:string, creatorId:string, taskInfo: Task){


    const family = await prisma.family.findUnique({
        where: { id: familyId }
    });

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    const creator =  await prisma.user.findUnique({
        where: { id: creatorId }
    });


    const pet = await prisma.pet.findUnique({
        where: { id: petId }
    });

    
    if (!family) {
        throw new Error(`Family with id ${familyId} does not exist.`);
    }

    if (!user) {
        throw new Error(`User with id ${userId} does not exist`);
    }

    if (!pet) {
        throw new Error(`Pet with id ${userId} does not exist`);
    }

  
    const createdTask = await prisma.task.create({
        data: {
            title: taskInfo.title,
            desc: taskInfo.desc,
            petId: taskInfo.petId,
            userId: taskInfo.userId,
            familyId: taskInfo.familyId,
            status: "OPEN",
            creatorId: taskInfo.creatorId,
            deadline: parseDate(taskInfo.deadline),
            provideProof: taskInfo.provideProof,
            suggestedTimeOutside: taskInfo.suggestedTimeOutside
        }
    });

    await prisma.pet.update({
        where: { id: petId },
        data: {
            tasks: {
                connect: { id: createdTask.id}
            }
        }
    });



}



export async function editTask(petId: string, familyId:string, userId:string, creatorId:string, taskInfo: any){


    const family = await prisma.family.findUnique({
        where: { id: familyId }
    });

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    const creator =  await prisma.user.findUnique({
        where: { id: creatorId }
    });


    const pet = await prisma.pet.findUnique({
        where: { id: petId }
    });

    
    if (!family) {
        throw new Error(`Family with id ${familyId} does not exist.`);
    }

    if (!user) {
        throw new Error(`User with id ${userId} does not exist`);
    }

    if (!pet) {
        throw new Error(`Pet with id ${userId} does not exist`);
    }

  
   const createdTask = await prisma.task.update({
  where: { id: taskInfo._id },
  data: {
    title: taskInfo.title, // No need for { set: taskInfo.title } for simple string fields
    desc: taskInfo.desc,
    petId: taskInfo.petId,
    userId: taskInfo.userId,
    familyId: taskInfo.familyId,
    status: taskInfo.status,
    creatorId: taskInfo.creatorId,
    deadline: parseDate(taskInfo.deadline),
    provideProof: taskInfo.provideProof
  }
});

    await prisma.pet.update({
        where: { id: petId },
        data: {
            tasks: {
                connect: { id: createdTask.id}
            }
        }
    });



}

