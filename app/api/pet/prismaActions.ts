'use server';

import prisma from "@/app/libs/prismadb";
import { PutObjectRetentionCommand } from "@aws-sdk/client-s3";
import { Family, Pet } from "@prisma/client";


  const parseDate = (date: string | Date): Date => {
    if (typeof date === "string") {
      return new Date(date);
    } else {
      return date;
    }
  };



export async function updateTotalTimeOutsidePet(petId: string, timeOutside: number) {
    // Fetch the pet and user from the database
    const pet = await prisma.pet.findUnique({
        where: { id: petId }
    });

    if (!pet) {
        throw new Error(`Pet with id ${petId} does not exist`);
    }

    console.log("updateTotalTimeOutside pet: ", JSON.stringify(pet));

    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];

    // Initialize timeOutsideLog or set to empty array if not present
    let timeOutsideLog = pet.timeOutsideLog ? pet.timeOutsideLog : [];

    // Find the index of the entry with the current date
    const dateIndex = timeOutsideLog.findIndex(log => log.startsWith(currentDate));

    if (dateIndex === -1) {
        // Current date not found, add a new entry to the top of the list
        timeOutsideLog.unshift(`${currentDate}:${timeOutside}`);
    } else {
        // Current date found, update the existing entry
        const [date, totalTime] = timeOutsideLog[dateIndex].split(":");
        const updatedTime = parseFloat(totalTime) + timeOutside;
        timeOutsideLog[dateIndex] = `${date}:${updatedTime}`;
    }

    // Update the pet in the database
    await prisma.pet.update({
        where: { id: petId },
        data: {
            timeOutsideLog: timeOutsideLog
        }
    });
}

export async function createNewPet(uId: string, familyId: string, petInfo: Pet) {

    const family = await prisma.family.findUnique({
        where: { id: familyId }
    });

    const user = await prisma.user.findUnique({
        where: { id: uId }
    });

    if (!family) {
        throw new Error(`Family with id ${familyId} does not exist.`);
    }

    if (!user) {
        throw new Error(`User with id ${uId} does not exist`);
    }

    if (family.adminId !== user.id) {
        throw new Error(`User with id ${uId} is not authorized to create pet`);
    }

    if (petInfo.id != ""){
        await editPet(uId, familyId, petInfo)
        return;
    }

    petInfo.familyId = familyId;
    

    const createdPet = await prisma.pet.create({
        data: {
            name: petInfo.name,
            familyId: petInfo.familyId,
            image: petInfo.image,
            dateOfBirth: parseDate(petInfo.dateOfBirth),
            timeOutsideGoalInHours: petInfo.timeOutsideGoalInHours
        }
    });-

    // Connect the newly created pet to the family
    await prisma.family.update({
        where: { id: familyId },
        data: {
            pets: {
                connect: { id: createdPet.id }
            }
        }
    });

    // console.log(`Pet created: ${JSON.stringify(createdPet)}`);

    return createdPet;
}

export async function editPet(uId: string, familyId: string, petInfo: Pet) {
    
    const pet = await prisma.pet.findUnique({
        where: {id: petInfo.id}
    });

    const family = await prisma.family.findUnique({
        where: { id: familyId }
    });

    const user = await prisma.user.findUnique({
        where: { id: uId }
    });

    if (!family) {
        throw new Error(`Family with id ${familyId} does not exist.`);
    }

    if (!user) {
        throw new Error(`User with id ${uId} does not exist`);
    }

    if (family.adminId !== user.id) {
        throw new Error(`User with id ${uId} is not authorized to create pet`);
    }

    console.log("edit pet: ", JSON.stringify(petInfo))
    
    console.log
    const createdPet = await prisma.pet.update({
        where: {id: petInfo.id},
        data: {
            name: petInfo.name,
            familyId: petInfo.familyId,
            image: petInfo.image,
            dateOfBirth: parseDate(petInfo.dateOfBirth),
            timeOutsideGoalInHours: petInfo.timeOutsideGoalInHours

        }
    });


    // console.log(`Pet created: ${JSON.stringify(createdPet)}`);

    return createdPet;
}

export async function retrieveUserFamilies(uId: string) {

    // retrieveUserFamiliesMongo(uId);
    const user = await prisma.user.findUnique({
      where: { id: uId },
      include: { families: true 
                
      },
    });

    if (!user) {
      throw new Error(`User with id ${uId} does not exist`);
    }

    const families = await Promise.all(user.families.map(async (family) => {
      const fullFamily = await prisma.family.findUnique({
        where: { id: family.id },
        include: { familyMembers: true, admin: true , pets: true},
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
    
    // console.log(family.familyMembers)
    return family.familyMembers;
}

export async function changeFamilyAdmin(newAdminId: string, currentUserId: string, familyId: string) {
    // Check if the current user is the admin of the family

    // console.log("changeFamilyAdmin", newAdminId, currentUserId, familyId)
    const family = await prisma.family.findUnique({
        where: { id: familyId },
    });

    if (!family) {
        throw new Error(`Family with id ${familyId} not found.`);
    }

    if (family.adminId !== currentUserId) {
        throw new Error(`User ${currentUserId} is not authorized to edit this family.`);
    }

    // Update the family with the new admin
    await prisma.family.update({
        where: { id: familyId },
        data: {
            adminId: newAdminId,
        },
    });
}

export async function joinFamily(uId: string, familyId: string) {
    const family = await prisma.family.findUnique({
        where: { id: familyId },
    });

    if (!family) {
        throw new Error(`Family with id ${familyId} not found.`);
    }

    await prisma.user.update({
        where: { id: uId },
        data: {
            families: {
                connect: { id: familyId }, // Connect the user to the existing family
            },
        },
    });
}

export async function deleteFamily(familyId: string) {
    // Find the family and its members
    const family = await prisma.family.findUnique({
        where: { id: familyId },
        include: { familyMembers: true },
    });

    if (!family) {
        throw new Error(`Family with id ${familyId} not found.`);
    }

    for (const member of family.familyMembers) {
        await prisma.user.update({
            where: { id: member.id },
            data: {
                familyIds: {
                    set: member.familyIds.filter((id) => id !== familyId),
                },
            },
        });
    }

    await prisma.family.delete({
        where: { id: familyId },
    });
}

export async function leaveFamily(uId: string, familyId: string) {
    const family = await prisma.family.findUnique({
        where: { id: familyId },
    });

    if (!family) {
        throw new Error(`Family with id ${familyId} not found.`);
    }

    await prisma.user.update({
        where: { id: uId },
        data: {
            families: {
                disconnect: { id: familyId }, // Disconnect the user from the family
            },
        },
    });
}

export async function updateFamilyName(familyId: string, newFamilyName: string) {
    const updatedFamily = await prisma.family.update({
        where: { id: familyId },
        data: { name: newFamilyName },
    });

    return updatedFamily;
}
export async function deletePet(
    userId: string,
    pet: Pet,
    adminId: string
) {
    const familyId = pet.familyId
    // Find the family
    const family = await prisma.family.findUnique({
        where: { id: familyId },
    });

    if (!family) {
        throw new Error(`Family with id ${familyId} not found.`);
    }
    // Find the user
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error(`User with id ${userId} not found.`);
    }

    // Verify admin access
    if (family.adminId !== adminId) {
        throw new Error(`Unauthorized: Only admins can remove members from this family.`);
    }
    // Disconnect the pet from the family

    // Remove the user from familyMembers in the family record
    await prisma.family.update({
        where: { id: familyId },
        data: {
            pets: {
                disconnect: { id: pet.id },
            },
        },
    });

    for (const taskId of pet.taskIds){
        await prisma.task.delete({
            where: {id: taskId}
        })
    }

    await prisma.pet.delete({
        where: {id: pet.id}
    })
}