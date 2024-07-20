"use client";

import { PetCrateTime, TasksForAPet } from "@/components/models";
import CrateTime from "@/components/pet/CrateTimeDisplay";
import TaskDisplay from "@/components/tasks/TaskDisplay";
import FamilyTaskDisplay from "@/components/tasks/FamilyTaskDisplay";

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
		<div className="bg-base-300 flex min-h-screen flex-col p-10 items-center">
			<h1 className="text-3xl font-semibold mb-1 ">Task Overview</h1>
			<FamilyTaskDisplay />
		</div>
	);
}
