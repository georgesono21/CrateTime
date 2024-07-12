"use client";
import mongoClient from "@/app/libs/mongodb";
import { useSession } from "next-auth/react";
import React from "react";

const FamilyTest = () => {
	function printSession() {
		watchCollections();
	}

	const watchCollections = () => {
		// console.log(mongoClient);
		// const mongodb = app.currentUser.mongoClient("mongodb-atlas");
		// const database = mongoClient.db("dev");
		//   const familyCollection = database.collection("Family");
		//   const changeStream = familyCollection.watch();
		// });
	};

	return (
		<div className="flex-wrap gap-3">
			<button
				className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5"
				onClick={() => printSession()}
			>
				Session
			</button>
		</div>
	);
};

export default FamilyTest;
