'use server';

import prisma from "@/app/libs/prismadb";
import { Family, Pet } from "@prisma/client";


  const parseDate = (date: string | Date): Date => {
    if (typeof date === "string") {
      return new Date(date);
    } else {
      return date;
    }
  };

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
            dateOfBirth: parseDate(petInfo.dateOfBirth)
        }
    });

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


// export async function editPetPhoto(uId: string, familyId: string, imageUrl: string, petInfo: Pet) {
    
//     const pet = await prisma.pet.findUnique({
//         where: {id: petInfo.id}
//     });

//     const family = await prisma.family.findUnique({
//         where: { id: familyId }
//     });

//     const user = await prisma.user.findUnique({
//         where: { id: uId }
//     });

//     if (!family) {
//         throw new Error(`Family with id ${familyId} does not exist.`);
//     }

//     if (!user) {
//         throw new Error(`User with id ${uId} does not exist`);
//     }

//     if (family.adminId !== user.id) {
//         throw new Error(`User with id ${uId} is not authorized to create pet`);
//     }

    
//     const createdPet = await prisma.pet.update({
//         where: {id: petInfo.id},
//         data: {
//             image: imageUrl,

//         }
//     });


//     // console.log(`Pet created: ${JSON.stringify(createdPet)}`);

//     return createdPet;
// }


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
    
    
    const createdPet = await prisma.pet.update({
        where: {id: petInfo.id},
        data: {
            name: petInfo.name,
            familyId: petInfo.familyId,
            image: petInfo.image,
            dateOfBirth: parseDate(petInfo.dateOfBirth)

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

    await prisma.pet.delete({
        where: {id: pet.id}
    })
}