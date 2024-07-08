"use client";
import { signIn } from "next-auth/react";
import { useCallback } from "react";

export interface ProviderInfo {
	providerName: string;
	displayName: string;
}

export default ({
	buttonText,
	providers,
}: {
	buttonText: string;
	providers: ProviderInfo[];
}) => (
	<div
		className=" grid col-1 justify-center border p-5"
		style={{ width: "300px" }}
	>
		<h1 className="text-2xl pb-10 font-semibold ">{buttonText}</h1>

		{providers.map((provider) => (
			<button
				key={provider.providerName}
				className="btn btn-ghost text-xl text-center dark:text-white btn-outline mb-5"
				onClick={async () =>
					await signIn(provider.providerName, { callbackUrl: "/home" })
				}
			>
				Use {provider.displayName}
			</button>
		))}
	</div>
);
