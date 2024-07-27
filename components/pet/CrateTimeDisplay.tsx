import React, { useEffect, useState } from "react";
import { PetCrateTime } from "../models";
import { Pet } from "@prisma/client";

const CrateTime = ({ pets }: { pets: Pet[] }) => {
	const [timePets, setTimePets] = useState<Pet[]>([]);
	const parseOutsideTimeToday = (pet: Pet): number => {
		let timeOutsideLog = pet.timeOutsideLog;

		if (timeOutsideLog.length === 0) {
			return 0;
		}

		// Get the top entry
		const topTimeEntry = timeOutsideLog[0].split(":");
		const [date, timeOutside] = topTimeEntry;

		// Parse date and compare with today
		const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
		const entryDate = new Date(date).toISOString().split("T")[0]; // Parse and format the entry date

		if (entryDate !== today) {
			return 0;
		}

		// Convert timeOutside to hours and format to one decimal place
		const timeOutsideHours = parseFloat(timeOutside) / 60;
		return parseFloat(timeOutsideHours.toFixed(1));
	};

	useEffect(() => {
		setTimePets(pets);
		console.log(`crateTime ${JSON.stringify(pets)}`);
	}, [pets]);

	// useEffect(() => {
	// 	console.log(`timePets ${JSON.stringify(timePets)}`);
	// }, [timePets]);

	return (
		<div className="flex items-center justify-center gap-10 flex-wrap">
			{timePets.map((pet, index) => (
				<div key={index} className="relative flex flex-col items-center">
					<h2 className="text-2xl font-semibold">{pet.name}</h2>
					<div className="relative w-24 h-24">
						<div
							className="absolute top-0 left-0 w-full h-full bg-green-400 rounded-full"
							style={{
								transform: `rotate(${
									(parseOutsideTimeToday(pet) / pet.timeOutsideGoalInHours) *
									360
								}deg)`,
								clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)",
							}}
						></div>
						<div className="absolute top-0 left-0 w-full h-full bg-base-200 rounded-full"></div>
						<div className="absolute flex justify-center items-center w-full h-full text-lg font-semibold">
							{Math.round(
								(parseOutsideTimeToday(pet) / pet.timeOutsideGoalInHours) * 100
							)}
							%
						</div>
					</div>
					<div className="mt-3 text-start text-xs">
						<p>
							<strong>Time Outside Today:</strong> {parseOutsideTimeToday(pet)}{" "}
							Hours
						</p>
						<p>
							<strong>Daily Time Outside Goal: </strong>{" "}
							{pet.timeOutsideGoalInHours} hours
						</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default CrateTime;
