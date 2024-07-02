"use client";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

function signInAndRedirect(): void {
	signIn();
	redirect("/home");
}

export default ({ text }: { text: string }) => (
	<button
		className="btn btn-ghost text-xl text-center"
		onClick={() => signInAndRedirect()}
	>
		{text}
	</button>
);
