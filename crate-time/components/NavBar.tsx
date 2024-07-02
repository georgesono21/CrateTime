import React from "react";
import Link from "next/link";
import AuthButton from "./auth/AuthButton";

const NavBar = () => {
	return (
		<div className="navbar bg-base-100">
			<div className="flex-1 flex justify-between items-center">
				<div className="flex-1 flex justify-center space-x-4">
					<Link
						href="/"
						className="btn btn-ghost text-xl text-center underline"
					>
						CrateTime
					</Link>

					<Link href="/" className="btn btn-ghost text-xl text-center">
						Home
					</Link>

					<Link href="/" className="btn btn-ghost text-xl text-center">
						Pet
					</Link>

					<Link href="/" className="btn btn-ghost text-xl text-center">
						Family
					</Link>

					<AuthButton homepage={false} />
				</div>
			</div>
		</div>
	);
};

export default NavBar;
