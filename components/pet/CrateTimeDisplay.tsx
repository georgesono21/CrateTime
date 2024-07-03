import React from "react";

export interface PetCrateTime {
	name: string;
	crateTimeTodayInMinutes: number;
	maxCrateTimeInMinutes: number;
}

const CrateTime = ({ pets }: { pets: PetCrateTime[] }) => {
	return (
		<div className="flex items-center justify-center gap-10">
			{pets.map((pet, index) => (
				<div key={index} className="relative flex flex-col items-center">
					<h2 className="text-2xl font-semibold">{pet.name}</h2>
					<div className="relative w-24 h-24">
						<div
							className="absolute top-0 left-0 w-full h-full bg-green-400 rounded-full"
							style={{
								transform: `rotate(${
									(pet.crateTimeTodayInMinutes / pet.maxCrateTimeInMinutes) *
									360
								}deg)`,
								clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)",
							}}
						></div>
						<div className="absolute top-0 left-0 w-full h-full bg-base-200 rounded-full"></div>
						<div className="absolute flex justify-center items-center w-full h-full text-lg font-semibold">
							{Math.round(
								(pet.crateTimeTodayInMinutes / pet.maxCrateTimeInMinutes) * 100
							)}
							%
						</div>
					</div>
					<div className="mt-3 text-start">
						<p>
							<strong>Time in Crate:</strong> {pet.crateTimeTodayInMinutes}{" "}
							minutes
						</p>
						<p>
							<strong>Max Allowed: </strong> {pet.maxCrateTimeInMinutes} minutes
						</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default CrateTime;
