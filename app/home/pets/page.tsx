"use client";
import FamiliesListWithSSE from "@/components/family/FamiliesListWithSSE";
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
		<div>
			<h1>Server-Sent Events Example</h1>
			<p>Check console for updates.</p>
			<FamiliesListWithSSE />
		</div>
	);
};

export default Home;
