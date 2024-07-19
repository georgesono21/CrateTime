import { Family, Pet, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { retrieveUserFamilies } from "../../app/api/task/prismaActions";

import { useSession } from "next-auth/react";
import MiniUserProfileView from "../user/MiniUserProfileView";
import PetPhotoNameDisplay from "../pet/PetPhotoNameDisplay";
import TaskDisplay from "./TaskDisplay";

const FamilyTaskDisplay = () => {
	const [families, setFamilies] = useState<Family[]>([]);
	const [familyMembers, setFamilyMembers] = useState<{ [key: string]: User[] }>(
		{}
	);
	const [familyPets, setFamilyPets] = useState<{ [key: string]: Pet[] }>({});

	const { data: session } = useSession();

	useEffect(() => {
		console.log(`familyMembers ${JSON.stringify(familyMembers)}`);
	}, [familyMembers]);

	useEffect(() => {
		console.log(`families ${JSON.stringify(families)}`);
	}, [families]);

	useEffect(() => {
		console.log(`familyPets ${JSON.stringify(familyPets)}`);
	}, [familyPets]);

	const fetchFamilies = async () => {
		if (session?.user?.id) {
			try {
				const response = await fetch("/api/task");
				const fetchedFamilies = await response.json();
				// console.log(`fetchedFamilies ${JSON.stringify(familiesData)}`);
				// return;

				setFamilies(fetchedFamilies);
				console.log("fetchedFamilies ", JSON.stringify(fetchedFamilies));
				fetchedFamilies.forEach((family: any) => {
					setFamilyMembers((prevMembers) => ({
						...prevMembers,
						[family._id]: family.familyMembers,
					}));
				});

				fetchedFamilies.forEach((family: any) => {
					setFamilyPets((prevPets) => ({
						...prevPets,
						[family._id]: family.pets,
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

	// useEffect(() => {
	// 	const eventSource = new EventSource(`/api/family`);
	// 	eventSource.onopen = (e) => {
	// 		console.log("pet server open ready");
	// 	};
	// 	eventSource.onmessage = async (e) => {
	// 		console.log("onmessage");
	// 		fetchData();
	// 	};

	// 	return () => {
	// 		eventSource.close();
	// 		console.log("EventSource connection closed");
	// 	};
	// }, []);

	return (
		<div className="m-8 flex-col justify-center">
			<div className="flex-wrap gap-3">
				{families.length == 0 ? <h1>No Families Yet...</h1> : null}
				{families.map((family: any) => (
					<div
						className="border border-color p-4 mb-4 rounded-lg shadow-sm"
						key={family._id}
					>
						<h2 className="text-xl font-semibold mb-2">{family.name}</h2>
						<div className="text-sm mb-2">
							Admin:{" "}
							<MiniUserProfileView
								user={
									familyMembers[family._id]?.find(
										(member: any) => member._id === family.adminId
									)
										? familyMembers[family._id].find(
												(member: any) => member._id === family.adminId
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
							{familyPets[family._id]?.map((pet: any) => (
								<li key={pet._id} className="flex gap-4">
									{/* <p>{JSON.stringif	y(pet)}</p> */}
									<div>
										<PetPhotoNameDisplay pet={pet} />
									</div>
								</li>
							))}
							<TaskDisplay petTasks={family.pets} familyId={family._id} />
						</ul>
					</div>
				))}
			</div>
		</div>
	);
};

export default FamilyTaskDisplay;
