"use client";
import {
	createNewFamily,
	joinFamily,
	retrieveFamilyMembers,
	retrieveUserFamilies,
} from "@/app/api/family/actions";
import { useSession } from "next-auth/react";
import React from "react";

const FamilyActionsDisplay = () => {
	const { data: session } = useSession();

	function printSession() {
		console.log(session);
	}

	return (
		<div className="flex-wrap gap-3">
			<button
				className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5"
				onClick={() => printSession()}
			>
				Session
			</button>
			<button
				className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5"
				onClick={async () => await createNewFamily(session?.user.id || "")}
			>
				Create
			</button>

			<button
				className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5"
				onClick={async () =>
					console.log(
						"retrieve: familyMembers: ",
						await retrieveFamilyMembers("668ba5865b12902e66f2f788")
					)
				}
			>
				Read
			</button>

			<button
				className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5"
				onClick={async () =>
					console.log(
						"retrieveUserFamilies: familyMembers: ",
						await retrieveUserFamilies(session?.user.id || "")
					)
				}
			>
				Retrieve Families
			</button>

			<button
				className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5"
				// onClick={async () => await joinFamily(session.id)}
			>
				Join
			</button>
			<button className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5">
				Leave
			</button>
			<button className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5">
				Delete
			</button>
		</div>
	);
};

export default FamilyActionsDisplay;
