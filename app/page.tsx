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
		<div className="min-h-screen bg-base-300 text-center">
			<h1 className="lg:text-3xl text-xl py-10">
				Welcome to CrateTime, a pet management app for your family or house!
			</h1>
			<Signin text={"Login/Signup"} />
		</div>
	);
}

export default page;
