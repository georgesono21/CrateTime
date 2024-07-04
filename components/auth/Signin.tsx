"use client";

import { signIn } from "next-auth/react";
import React from "react";

export interface ProviderInfo {
	providerName: string;
	displayName: string;
}

interface SigninProps {
	buttonText: string;
	providers: ProviderInfo[];
}

const Signin: React.FC<SigninProps> = ({ buttonText, providers }) => (
	<div
		className="items-center grid grid-cols-1 gap-4"
		style={{ width: "20%", margin: "0 auto" }}
	>
		<h1 className="text-xl mb-5">{buttonText}</h1>
		{providers.map((provider, index) => (
			<button
				key={index}
				className="btn btn-ghost text-xl text-center dark:text-white btn-outline"
				onClick={() => signIn(provider.providerName)}
			>
				{provider.displayName}
			</button>
		))}
	</div>
);

export default Signin;
