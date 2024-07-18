
//User
'use server'
import prisma from '@/app/libs/prismadb';
import { ObjectId } from 'mongodb';




export async function getUserIdFromEmail(email: string): Promise<string | null> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase(), // Ensure case-insensitive search if needed
            },
            select: {
                id: true,
            },
        });

        return user?.id || null; // Return userId if found, otherwise null
    } catch (error) {
        console.error(`Error fetching user by email ${email}:`, error);
        throw new Error(`Failed to fetch user by email ${email}: ${error.message}`);
    }
}

export async function getUserDocumentById(userId: string) {

    if (userId == "") {
        return null
    }
    try {
        // Validate ObjectId if necessary (uncomment if needed)
        // if (!ObjectId.isValid(userId)) {
        //     throw new Error('Invalid user ID');
        // }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                families: true, // Assuming 'familyIds' is the field in your user model
                // Expand other related fields if necessary
            },
        });

        if (!user) {
            throw new Error(`User with ID ${userId} not found.`);
        }

        // console.log("user: ", user)

        return user;
    } catch (error) {
        console.error(`Error fetching user document by ID ${userId}:`, error);
        throw new Error(`Failed to fetch user document by ID ${userId}: ${error.message}`);
    }
}

export async function updateUserDocument(userId: string, data: { name?: string; image?: string }) {
    if (userId === "") {
        return null;
    }
    try {

        console.log("update: " ,userId, data)
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...data,
            },
        });

        return updatedUser;
    } catch (error) {
        console.error(`Error updating user document by ID ${userId}:`, error);
        throw new Error(`Failed to update user document by ID ${userId}: ${error.message}`);
    }
}

export async function deleteAccount(userId: string) {
    if (!userId) {
        throw new Error("User ID must be provided.");
    }
try {
        // Find the user
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                invites: true,
                families: true,
            },
        });

        if (!user) {
            throw new Error(`User with ID ${userId} not found.`);
        }

        // Update invitations received by the user
        await Promise.all(
            user.invitationsFamilyIds.map(async (familyId) => {
                const family = await prisma.family.findUnique({
                    where: {
                        id: familyId,
                    },
                });

                if (!family) {
                    throw new Error(`Family with ID ${familyId} not found.`);
                }

                // Remove userId from invitationToUserIds
                await prisma.family.update({
                    where: { id: familyId },
                    data: {
                        invitationToUserIds: {
                            set: family.invitationToUserIds.filter(id => id !== userId),
                        },
                    },
                });
            })
        );

        // Update families where the user is a member
        await Promise.all(
            user.familyIds.map(async (familyId) => {
                const family = await prisma.family.findUnique({
                    where: {
                        id: familyId,
                    },
                });

                if (!family) {
                    throw new Error(`Family with ID ${familyId} not found.`);
                }

                // Remove userId from membersIds
                await prisma.family.update({
                    where: { id: familyId },
                    data: {
                        membersIds: {
                            set: family.membersIds.filter(id => id !== userId),
                        },
                    },
                });
            })
        );


            // Delete the user
            const deletedUser = await prisma.user.delete({
                where: {
                    id: userId,
                },
            });

            return deletedUser;
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw new Error(`Failed to delete user with ID ${userId}: ${error.message}`);
    }
}