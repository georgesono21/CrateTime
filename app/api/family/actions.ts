'use server';

import prisma from "@/app/libs/prismadb";

export async function createNewFamily(uId: string) {
    const family = await prisma.family.create({
        data: {
            name: "New Family Name", // Replace with actual family name or data
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


export async function editFamily(newAdminId: string, currentUserId: string, familyId: string) {
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
    const family = await prisma.family.findUnique({
        where: { id: familyId },
    });

    if (!family) {
        throw new Error(`Family with id ${familyId} not found.`);
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
