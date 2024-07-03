import React from "react";
import Link from "next/link";
import AuthButton from "./auth/AuthButton";
import Signout from "./auth/Signout";

const NavBar = () => {
	return (
		<div className="navbar bg-base-100">
			<div className="flex-1 flex justify-between items-center">
				<div className="flex-1 flex justify-center space-x-4">
					<Link
						href="/"
						className="sm:text-base md:text-xl lg:text-xl btn btn-ghost  text-center underline"
					>
						CrateTime
					</Link>

					<Link
						href="/"
						className="sm:text-base md:text-xl lg:text-xl btn btn-ghost  text-center"
					>
						Home
					</Link>

					<Link
						href="/"
						className="sm:text-base md:text-xl lg:text-xl btn btn-ghost  text-center"
					>
						Pets
					</Link>

					<Link
						href="/"
						className="sm:text-base md:text-xl lg:text-xl btn btn-ghost text-center"
					>
						Family
					</Link>

					<Signout />
				</div>
			</div>
		</div>
	);
};

export default NavBar;
