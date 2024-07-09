'use server';

import prisma from "@/app/libs/prismadb";
import { Family } from "@prisma/client";

export async function createNewFamily(uId: string, newFamilyName: string) {
    const family = await prisma.family.create({
        data: {
            name: newFamilyName, // Replace with actual family name or data
			adminId: uId
        },
    });

    await prisma.user.update({
        where: { id: uId },
        data: {
            families: {
                connect: { id: family.id }, // Connect the user to the new family
            },
        },
    });
}

export async function retrieveUserFamilies(uId: string) {
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

    console.log(`retrieveUserFamily: uId: ${uId}: families: ${JSON.stringify(families, null, 2)}`);
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
    
    console.log(family.familyMembers)
    return family.familyMembers;
}


export async function changeFamilyAdmin(newAdminId: string, currentUserId: string, familyId: string) {
    // Check if the current user is the admin of the family
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