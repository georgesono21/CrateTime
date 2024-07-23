import { Family, Pet, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import TaskDisplay from "./TaskDisplay";

const FamilyTaskDisplay = () => {
	const [families, setFamilies] = useState<Family[]>([]);
	const [familyMembers, setFamilyMembers] = useState<{ [key: string]: User[] }>(
		{}
	);
	const [familyPets, setFamilyPets] = useState<{ [key: string]: Pet[] }>({});

	const { data: session } = useSession();

	// useEffect(() => {
	// 	console.log(
	// 		`familyTaskDisplay familyMembers ${JSON.stringify(familyMembers)}`
	// 	);
	// }, [familyMembers]);

	// useEffect(() => {
	// 	console.log(`familyTaskDisplay familyPets ${JSON.stringify(familyPets)}`);
	// }, [familyPets]);

	// useEffect(() => {
	// 	console.log(`familyTaskDisplay families ${JSON.stringify(familyPets)}`);
	// }, [families]);

	useEffect(() => {
		const eventSource = new EventSource(`/api/task`);
		eventSource.onopen = (e) => {
			console.log("task server open ready");
		};
		eventSource.onmessage = async (e) => {
			console.log("onmessage");
			// console.log(`session fetch ${JSON.stringify(session)}`);
			await fetchData();
		};

		return () => {
			eventSource.close();
			console.log("EventSource connection closed");
		};
	}, []);

	const fetchData = async () => {
		await fetchFamilies();
	};

	const fetchFamilies = async () => {
		// console.log(`session fetch ${JSON.stringify(session)}`);
		if (session?.user?.id) {
			try {
				const response = await fetch("/api/task", {
					cache: "no-store",
					method: "POST", // Use POST method
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ userId: session.user.id }), // Include user ID in the body
				});

				const fetchedFamilies = await response.json();

				setFamilies(fetchedFamilies);

				const members = {};
				const pets = {};

				fetchedFamilies.forEach((family: any) => {
					members[family._id] = family.familyMembers;
					pets[family._id] = family.pets;
				});

				setFamilyMembers(members);
				setFamilyPets(pets);
			} catch (error) {
				console.error("Failed to retrieve families:", error);
			}
		} else {
			console.log("invalid session");
		}
	};

	useEffect(() => {
		fetchData();
	}, [session?.user.id]);

	return (
		<div className="m-8 flex-col justify-center">
			<div className="flex-wrap gap-3">
				{families.length == 0 ? <h1>No Families Yet...</h1> : null}
				{families.map((family: any) => (
					<div
						className="border border-color p-4 mb-4 rounded-lg shadow-sm"
						key={family._id}
					>
						<h2 className="text-3xl font-semibold mb-2 text-center">
							{family.name}
						</h2>

						<ul>
							<TaskDisplay
								petTasks={family.pets}
								familyId={family._id}
								familyMembers={familyMembers}
							/>
						</ul>
					</div>
				))}
			</div>
		</div>
	);
};

export default FamilyTaskDisplay;
