"use client";
import { signOut } from "next-auth/react";

export default () => (
	<button
		className="btn btn-ghost text-xl text-center"
		onClick={() => signOut()}
	>
		Logout
	</button>
);
