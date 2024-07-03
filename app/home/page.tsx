import CrateTime, { PetCrateTime } from "@/components/pet/CrateTimeDisplay";
import TaskDisplay, { TasksForAPet } from "@/components/tasks/TaskDisplay";

import { crateTimeToday, petTasks } from "@/mockData";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<div className="bg-base-300 flex min-h-screen flex-col p-24">
			<div className="mb-10">
				<h1 className="text-3xl mb-5 font-bold text-center">Pet CrateTime</h1>
				<CrateTime pets={crateTimeToday as PetCrateTime[]} />
			</div>
			<div>
				<h1 className="text-3xl mb-5 font-bold text-center">Task Overview</h1>
				<TaskDisplay petTasks={petTasks as TasksForAPet[]} />
			</div>
		</div>
	);
}
