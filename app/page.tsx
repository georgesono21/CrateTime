"use client";

import Signin from "@/components/auth/Signin";
import { getSession, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ProviderInfo } from "@/components/auth/Signin";
import React from "react";

const providers = [
	{ providerName: "github", displayName: "GitHub" },
	{ providerName: "google", displayName: "Google" },
] as ProviderInfo[];

function page() {
	const { data: session } = useSession();

	if (session) {
		// console.log("use Session ", session);
		redirect("/home");
	}

	return (
		<div className="min-h-screen flex flex-col items-center bg-base-300 text-center">
			<h1 className="lg:text-3xl text-xl my-10 ">
				Welcome to CrateTime, a pet management app for your family or house!
			</h1>
			<Signin buttonText={"Login/Signup"} providers={providers} />
		</div>
	);
}

export default page;
