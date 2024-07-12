"use client";

import { PetCrateTime, TasksForAPet } from "@/components/models";
import CrateTime from "@/components/pet/CrateTimeDisplay";
import TaskDisplay from "@/components/tasks/TaskDisplay";

import { crateTimeToday, petTasks } from "@/mockData";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import prisma from "../libs/prismadb";
import { createNewFamily } from "../api/family/prismaActions";
// import { createNewFamily } from "../libs/dbFuncs";

export default function Home() {
	// const session = useSession();

	// async function test() {
	// 	console.log("test useSession: ", session);

	// 	if (session.data && session.data.user) {
	// 		await createNewFamily(session.data.user.id);
	// 	}
	// }

	return (
		<div className="bg-base-300 flex min-h-screen flex-col p-10">
			{/* <button className="border" onClick={async () => await test()}>
				db test
			</button> */}
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
