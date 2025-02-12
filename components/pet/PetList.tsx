"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { deletePet, retrieveUserFamilies } from "@/app/api/pet/prismaActions";
import { Family, Pet, User } from "@prisma/client";
import CreatePetModal from "./modals/CreatePetModal";
import { isNull } from "util";
import { createNewPet } from "@/app/api/pet/prismaActions";
import RemovePetModal from "./modals/RemovePet";
import PetPhotoNameDisplay from "./PetPhotoNameDisplay";
import MiniUserProfileView from "../user/MiniUserProfileView";
import React from "react";

const PetList = () => {
	const [families, setFamilies] = useState<Family[]>([]);
	const [familyMembers, setFamilyMembers] = useState<{ [key: string]: User[] }>(
		{}
	);
	const [familyPets, setFamilyPets] = useState<{ [key: string]: Pet[] }>({});
	const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);

	const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

	const [newPet, setNewPet] = useState<Pet>({
		id: "",
		name: "",
		image: "",
		dateOfBirth: new Date(),
		createdAt: new Date(),
		updatedAt: new Date(),
		familyId: "",
		ignore: [],
		taskIds: [],
		timeOutsideGoalInHours: 0,
		timeOutsideLog: [],
	});

	const [isCreatePetModalOpen, setCreatePetModalOpen] =
		useState<boolean>(false);

	const [isRemovePetModalOpen, setRemovePetModalOpen] =
		useState<boolean>(false);

	const { data: session } = useSession();

	const getFamilyFromSelectedFamilyId = (): Family | undefined => {
		if (!selectedFamilyId) {
			return undefined;
		}

		return families.find((family) => family.id === selectedFamilyId);
	};

	const getAdminIdFromFamilyFromSelectedFamilyId = (): string => {
		const family = getFamilyFromSelectedFamilyId();
		if (family) {
			return family.adminId;
		}
		return "";
	};

	const closeModal = () => {
		setCreatePetModalOpen(false);
		setRemovePetModalOpen(false);
		setNewPet({
			id: "",
			name: "",
			image: "",
			dateOfBirth: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
			familyId: "",
			ignore: [],
			taskIds: [],
			timeOutsideGoalInHours: 0,
			timeOutsideLog: [],
		} as Pet);
		setSelectedFamilyId(null);
	};

	const fetchFamilies = async () => {
		// console.log(`session fetch ${JSON.stringify(session)}`);
		if (session?.user?.id) {
			try {
				const fetchedFamilies = await retrieveUserFamilies(session.user.id);
				setFamilies(fetchedFamilies);
				// console.log("fetchedFamilies ", JSON.stringify(fetchedFamilies));
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

	useEffect(() => {
		const eventSource = new EventSource(`/api/pet`);
		eventSource.onopen = (e) => {
			console.log("pet server open ready");
		};
		eventSource.onmessage = async (e) => {
			console.log("onmessage");

			fetchData();
		};

		return () => {
			eventSource.close();
			console.log("EventSource connection closed");
		};
	}, []);

	const handleCreatePet = async () => {
		// Logic to create pet
		console.log(
			`newPet: ${JSON.stringify(newPet)} selectedFamilyId: ${selectedFamilyId}`
		);

		await createNewPet(session?.user.id || "", selectedFamilyId || "", newPet);
		fetchData();
		setNewPet({
			id: "",
			name: "",
			image: "",
			dateOfBirth: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
			familyId: "",
			ignore: [],
			taskIds: [],
			timeOutsideGoalInHours: 0,
			timeOutsideLog: [],
		} as Pet);

		setSelectedFamilyId(null);
	};

	const handleRemovePet = async () => {
		// Logic to create pet
		// console.log(
		// 	`newPet: ${JSON.stringify(newPet)} selectedFamilyId: ${selectedFamilyId}`
		// );

		await deletePet(
			session?.user.id || "",
			newPet,
			getAdminIdFromFamilyFromSelectedFamilyId()
		);
		fetchData();
		setNewPet({
			id: "",
			name: "",
			image: "",
			dateOfBirth: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
			familyId: "",
			ignore: [],
			taskIds: [],
			timeOutsideGoalInHours: 0,
			timeOutsideLog: [],
		} as Pet);
		setSelectedFamilyId(null);
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
						<div className="text-sm mb-2">
							Admin:
							<MiniUserProfileView
								user={
									familyMembers[family.id]?.find(
										(member) => member.id === family.adminId
									)
										? familyMembers[family.id].find(
												(member) => member.id === family.adminId
										  )
										: undefined // Provide a default user object if admin is unknown
								}
							/>
						</div>

						<h3 className="font-semibold my-2">Pets:</h3>
						<ul>
							{!familyPets[family.id] ||
								(familyPets[family.id].length == 0 && (
									<div>
										<h1 className=" text-slate-300 italic">
											{" "}
											No pets created yet.
										</h1>
									</div>
								))}
							{familyPets[family.id]?.map((pet) => (
								<li key={pet.id} className="flex gap-4">
									{/* <p>{JSON.stringify(pet)}</p> */}
									<div>
										<PetPhotoNameDisplay pet={pet} />
									</div>

									{family.adminId === session?.user.id && (
										<div className="flex justify-center">
											<button
												className="text-blue-500 mr-5"
												onClick={() => {
													setSelectedFamilyId(family.id);
													setNewPet(pet);
													setCreatePetModalOpen(true);
												}}
											>
												Edit
											</button>
											<button
												className="text-red-500"
												onClick={() => {
													setSelectedFamilyId(family.id);
													setNewPet(pet);
													setRemovePetModalOpen(true);
												}}
											>
												Remove Pet
											</button>
										</div>
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
								Add New Pet
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

			<RemovePetModal
				isOpen={isRemovePetModalOpen}
				onClose={closeModal}
				onConfirm={handleRemovePet}
				pet={newPet}
				currentUId={session?.user.id || ""}
				adminUId={getAdminIdFromFamilyFromSelectedFamilyId()}
			/>
		</div>
	);
};

export default PetList;
