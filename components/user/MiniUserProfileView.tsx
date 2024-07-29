import { User } from "@prisma/client";
import React from "react";
import Link from "next/link";

const MiniUserProfileView = ({ user }: { user: any | undefined }) => {
	return (
		<Link href={`/home/profile?uid=${user.id || user._id}`}>
			<div className="flex items-center m-3">
				<img
					src={user?.image || ""}
					alt={user?.name || ""}
					className="rounded-full w-12 h-12 mr-4"
				/>
				<span>{user?.name}</span>
			</div>
		</Link>
	);
};

export default MiniUserProfileView;
