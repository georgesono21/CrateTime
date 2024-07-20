'use server';

import prisma from "@/app/libs/prismadb";
import { Family, Task } from "@prisma/client";

 const parseDate = (date: string | Date): Date => {
    if (typeof date === "string") {
      return new Date(date);
    } else {
      return date;
    }
  };

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
            deadline: parseDate(taskInfo.deadline)
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

export async function retrieveUserFamilies(uId: string) {

    // retrieveUserFamiliesMongo(uId);
    const user = await prisma.user.findUnique({
      where: { id: uId },
      include: { families: true },
    });

    if (!user) {
      throw new Error(`User with id ${uId} does not exist`);
    }

    const families = await Promise.all(user.families.map(async (family) => {
      const fullFamily = await prisma.family.findUnique({
        where: { id: family.id },
        include: { familyMembers: true, admin: true },
      });

      return fullFamily;
    }));

    if (!families) {
      throw new Error(`User does not have a families array in user document or user DNE`);
    }

    // console.log(`retrieveUserFamily: uId: ${uId}: families: ${JSON.stringify(families, null, 2)}`);
    return families as Family[];
}

export async function retrieveFamilyMembers(familyId: string) {
    const family = await prisma.family.findUnique({
        where: { id: familyId },
        include: { familyMembers: true },
    });

    if (!family) {
        throw new Error(`Family with id ${familyId} not found.`);
    }
    
    return family.familyMembers;
}
