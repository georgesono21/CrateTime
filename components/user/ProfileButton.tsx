"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const ProfileButton = () => {
	const { data: session } = useSession();

	if (session) {
		return (
			<Link
				className="sm:text-base md:text-xl lg:text-xl btn btn-ghost  text-center"
				href={`/home/profile?uid=${session.user.id}`}
			>
				Profile
			</Link>
		);
	} else {
		return null; // or render a login link or component if session is not present
	}
};

export default ProfileButton;
