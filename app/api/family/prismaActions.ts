'use server';

import prisma from "@/app/libs/prismadb";
import { Family } from "@prisma/client";
import { retrieveUserFamiliesMongo } from "./mongoActions";

// Send an invitation to join a family
export async function sendFamilyInvitation(familyId: string, userId: string) {
    const family = await prisma.family.findUnique({
        where: { id: familyId },
    });

    if (!family) {
        throw new Error(`Family with id ${familyId} not found.`);
    }

    await prisma.family.update({
        where: { id: familyId },
        data: {
            invitationToUserIds: {
                push: userId
            }
        }
    });

    await prisma.user.update({
        where: { id: userId },
        data: {
            invitationsFamilyIds: {
                push: familyId
            }
        }
    });
}

// Accept an invitation to join a family
export async function acceptFamilyInvitation(userId: string, familyId: string) {
    const family = await prisma.family.findUnique({
        where: { id: familyId },
    });

    if (!family) {
        throw new Error(`Family with id ${familyId} not found.`);
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            families: {
                connect: { id: familyId },
            },
            invitationsFamilyIds: {
                set: (await prisma.user.findUnique({ where: { id: userId } }))?.invitationsFamilyIds.filter(id => id !== familyId),
            }
        }
    });

    await prisma.family.update({
        where: { id: familyId },
        data: {
            invitationToUserIds: {
                set: (await prisma.family.findUnique({ where: { id: familyId } }))?.invitationToUserIds.filter(id => id !== userId),
            }
        }
    });

}

// Reject an invitation to join a family
export async function rejectFamilyInvitation(userId: string, familyId: string) {
    await prisma.user.update({
        where: { id: userId },
        data: {
            invitationsFamilyIds: {
                set: (await prisma.user.findUnique({ where: { id: userId } }))?.invitationsFamilyIds.filter(id => id !== familyId),
            }
        }
    });

    await prisma.family.update({
        where: { id: familyId },
        data: {
            invitationToUserIds: {
                set: (await prisma.family.findUnique({ where: { id: familyId } }))?.invitationToUserIds.filter(id => id !== userId),
            }
        }
    });
}

// Retrieve the invitations sent to a user
export async function getUserInvitations(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { invites: true },
    });

    if (!user) {
        throw new Error(`User with id ${userId} not found.`);
    }

    return user.invites;
}

// Other family-related functions
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
export async function removeMemberFromFamily(
    userId: string,
    familyId: string,
    adminId: string
) {
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

    if (userId == adminId){ //leaving the family
        
        // Disconnect the user from the family
        await prisma.user.update({
            where: { id: userId },
            data: {
                families: {
                    disconnect: { id: familyId },
                },
            },
        });

        // Remove the user from familyMembers in the family record
        await prisma.family.update({
            where: { id: familyId },
            data: {
                familyMembers: {
                    disconnect: { id: userId },
                },
            },
        });
        return
    }

    // Verify admin access
    if (family.adminId !== adminId) {
        throw new Error(`Unauthorized: Only admins can remove members from this family.`);
    }

    
    // Disconnect the user from the family
    await prisma.user.update({
        where: { id: userId },
        data: {
            families: {
                disconnect: { id: familyId },
            },
        },
    });

    // Remove the user from familyMembers in the family record
    await prisma.family.update({
        where: { id: familyId },
        data: {
            familyMembers: {
                disconnect: { id: userId },
            },
        },
    });
}