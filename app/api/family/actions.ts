'use server'

import prisma from "@/app/libs/prismadb";

export async function createNewFamily(uId: string) {
	const family = await prisma.family.create({
		data: {
			name: "New Family Name", // Replace with actual family name or data
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

	console.log("done");
}

    
export async function joinFamily(uId: string, familyId: string) {
	return
}

export async function deleteFamily(uId: string, familyId: string) {
	return
}

export async function leaveFamily(uId: string, newAdminId:string, familyId: string) {
	return
}


    