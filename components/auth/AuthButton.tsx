"use client";
// Import necessary modules
import { useSession } from "next-auth/react";
import Signin from "./Signin";
import Signout from "./Signout";
import React from "react";

// Define the AuthButton component
const AuthButton = ({ isWelcome }: { isWelcome: boolean }) => {
	const { data: session } = useSession();

	if (session) {
		return <Signout />;
	}

	return;
};

export default AuthButton;
