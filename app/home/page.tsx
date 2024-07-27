"use client";

import CrateTime from "@/components/pet/CrateTimeDisplay";
import FamilyTaskDisplay from "@/components/tasks/FamilyTaskDisplay";
import { crateTimeToday } from "@/mockData";

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
			<FamilyTaskDisplay />
		</div>
	);
}
