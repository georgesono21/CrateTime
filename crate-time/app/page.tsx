"use client";

import Signin from "@/components/auth/Signin";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

function page() {
	const { data: session } = useSession();

	if (session) {
		redirect("/home");
	}
	return (
		<div>
			<h1>CrateTime</h1>
			<p>
				Welcome to CrateTime, a pet management app for your family or house!
			</p>
			<Signin text={"Login/Signup"} />
		</div>
	);
}

export default page;
