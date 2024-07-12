"use client";
import FamiliesListWithSSE from "@/components/family/FamiliesListWithSSE";
import PetList from "@/components/pet/PetList";
import { useEffect } from "react";

const Home = () => {
	// useEffect(() => {
	// 	const eventSource = new EventSource(`/api/events`);
	// 	eventSource.onopen = (e) => {
	// 		console.log("server open");
	// 	};
	// 	eventSource.onmessage = (e) => {
	// 		console.log("onmessage");
	// 		console.log(e);
	// 	};
	// }, []);

	return (
		<div className="bg-base-300 flex min-h-screen flex-col items-center p-10">
			<h1 className="text-3xl font-semibold mb-1 ">Pet Overview</h1>
			<PetList />
		</div>
	);
};

export default Home;
