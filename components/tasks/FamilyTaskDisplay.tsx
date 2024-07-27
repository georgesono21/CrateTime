import { Family, Pet, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TaskDisplay from "./TaskDisplay";
import CrateTime from "../pet/CrateTimeDisplay";
import { crateTimeToday } from "@/mockData";

// Define types for MongoDB family data
export interface MongoFamily {
	_id: string;
	name: string;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
	adminId: string;
	membersIds: string[];
	petIds: string[];
	invitationToUserIds: string[];
	pets: Pet[]; // Assuming this is an array of Pet objects
	familyMembers: User[]; // Assuming this is an array of User objects
}

const FamilyTaskDisplay = () => {
	const [families, setFamilies] = useState<MongoFamily[]>([]);
	const [familyMembers, setFamilyMembers] = useState<{ [key: string]: User[] }>(
		{}
	);
	const [familyPets, setFamilyPets] = useState<{ [key: string]: Pet[] }>({});

	const { data: session } = useSession();

	useEffect(() => {
		const eventSource = new EventSource(`/api/task`);
		eventSource.onopen = () => {
			console.log("task server open ready");
		};
		eventSource.onmessage = async () => {
			console.log("onmessage");
			await fetchData();
		};

		return () => {
			eventSource.close();
			console.log("EventSource connection closed");
		};
	}, []);
	const today = () => {
		return new Date().toISOString().split("T")[0];
	};

	const fetchData = async () => {
		await fetchFamilies();
	};

	const fetchFamilies = async () => {
		if (session?.user?.id) {
			try {
				const response = await fetch("/api/task", {
					cache: "no-store",
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ userId: session.user.id }),
				});

				const fetchedFamilies: MongoFamily[] = await response.json();

				setFamilies(fetchedFamilies);

				const members: { [key: string]: User[] } = {};
				const pets: { [key: string]: Pet[] } = {};

				fetchedFamilies.forEach((family) => {
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
	}, [session?.user?.id]);

	return (
		<div className="my-8 flex-col justify-center">
			<div className="flex-wrap gap-3">
				{families.length === 0 ? <h1>No Families Yet...</h1> : null}
				{families.map((family) => (
					<div
						className="border  border-color p-4 mb-4 rounded-lg shadow-sm"
						key={family._id}
					>
						<h2 className="text-3xl underline font-semibold mb-8 text-center">
							{family.name}
						</h2>

						<h1 className="text-3xl font-semibold my-4 text-center ">
							Pet Time Outside{" "}
							<p className="text-xs font-normal"> for {`(${today()})`}</p>
						</h1>
						<CrateTime pets={family.pets} />

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
