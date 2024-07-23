"use client";

import FamilyTaskDisplay from "@/components/tasks/FamilyTaskDisplay";

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
