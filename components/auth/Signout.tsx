"use client";
// Import necessary modules
import { signOut, useSession } from "next-auth/react";
import React from "react";

// Define the AuthButton component
const Signout = () => {
	const { data: session } = useSession();

	if (session) {
		return (
			<button
				className="sm:text-base md:text-xl lg:text-xl btn btn-ghost text-center"
				onClick={() => signOut()}
			>
				Logout
			</button>
		);
	}

	return;
};

export default Signout;
