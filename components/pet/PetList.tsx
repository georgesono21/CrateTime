"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { retrieveUserFamilies } from "@/app/api/pet/prismaActions";
import { Family, Pet, User } from "@prisma/client";
import CreatePetModal from "./modals/CreatePetModal";
import { isNull } from "util";
import { createNewPet } from "@/app/api/pet/prismaActions";

const PetList = () => {
	const [families, setFamilies] = useState<Family[]>([]);
	const [familyMembers, setFamilyMembers] = useState<{ [key: string]: User[] }>(
		{}
	);
	const [familyPets, setFamilyPets] = useState<{ [key: string]: Pet[] }>({});
	const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);

	const [selectePetId, setSelectedPetId] = useState<string | null>(null);

	const [newPet, setNewPet] = useState<Pet>({
		id: "",
		name: "",
		image: "",
		dateOfBirth: new Date(),
		createdAt: new Date(),
		updatedAt: new Date(),
		familyId: "",
		ignore: [],
	});

	const [isCreatePetModalOpen, setCreatePetModalOpen] =
		useState<boolean>(false);

	const { data: session } = useSession();

	const closeModal = () => {
		setCreatePetModalOpen(false);
	};

	const fetchFamilies = async () => {
		if (session?.user?.id) {
			try {
				const fetchedFamilies = await retrieveUserFamilies(session.user.id);
				setFamilies(fetchedFamilies);
				console.log("fetchedFamilies ", JSON.stringify(fetchedFamilies));
				fetchedFamilies.forEach((family: any) => {
					setFamilyMembers((prevMembers) => ({
						...prevMembers,
						[family.id]: family.familyMembers,
					}));
				});

				fetchedFamilies.forEach((family: any) => {
					setFamilyPets((prevPets) => ({
						...prevPets,
						[family.id]: family.pets,
					}));
				});
			} catch (error) {
				console.error("Failed to retrieve families:", error);
			}
		}
	};

	const fetchData = async () => {
		await fetchFamilies();
	};

	useEffect(() => {
		fetchData();
	}, [session?.user.id]);

	const handleCreatePet = async () => {
		// Logic to create pet
		console.log(
			`newPet: ${JSON.stringify(newPet)} selectedFamilyId: ${selectedFamilyId}`
		);

		await createNewPet(session?.user.id || "", selectedFamilyId || "", newPet);
	};

	return (
		<div className="m-8 flex-col justify-center">
			<div className="flex-wrap gap-3">
				{families.length == 0 ? <h1>No Families Yet...</h1> : null}
				{families.map((family) => (
					<div
						className="border border-color p-4 mb-4 rounded-lg shadow-sm"
						key={family.id}
					>
						<h2 className="text-xl font-semibold mb-2">{family.name}</h2>
						<p className="text-sm mb-2">
							Admin:{" "}
							{familyMembers[family.id]?.find(
								(member) => member.id === family.adminId
							)
								? `${
										familyMembers[family.id].find(
											(member) => member.id === family.adminId
										)?.name
								  } (${
										familyMembers[family.id].find(
											(member) => member.id === family.adminId
										)?.email
								  })`
								: "Unknown"}
						</p>
						<h3 className="font-semibold mb-2">Pets:</h3>
						<ul>
							{!familyPets[family.id] && (
								<div>
									<h1 className=" text-slate-300 italic">
										{" "}
										No pets created yet.
									</h1>
								</div>
							)}
							{familyPets[family.id]?.map((pet) => (
								<li key={pet.id} className="flex gap-4">
									<p>{pet.name}</p>

									{family.adminId === session?.user.id && (
										<button
											className="text-red-500"
											onClick={() => setSelectedFamilyId(family.id)}
										>
											Remove Pet
										</button>
									)}
								</li>
							))}
						</ul>
						{family.adminId === session?.user.id && (
							<button
								className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
								onClick={() => {
									setSelectedFamilyId(family.id);
									setCreatePetModalOpen(true);
								}}
							>
								Add Pet
							</button>
						)}
					</div>
				))}
			</div>
			<CreatePetModal
				isOpen={isCreatePetModalOpen}
				onClose={closeModal}
				onConfirm={handleCreatePet}
				newPet={newPet}
				setNewPet={setNewPet}
			/>
		</div>
	);
};

export default PetList;
