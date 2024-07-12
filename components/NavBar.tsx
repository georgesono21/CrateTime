import React from "react";
import Link from "next/link";
import AuthButton from "./auth/AuthButton";
import Signout from "./auth/Signout";
import ProfileButton from "./user/ProfileButton";

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
						href="/home"
						className="sm:text-base md:text-xl lg:text-xl btn btn-ghost  text-center"
					>
						Home
					</Link>

					<Link
						href="/home/pets"
						className="sm:text-base md:text-xl lg:text-xl btn btn-ghost  text-center"
					>
						Pets
					</Link>

					<Link
						href="/home/family"
						className="sm:text-base md:text-xl lg:text-xl btn btn-ghost text-center"
					>
						Family
					</Link>

					<ProfileButton />
					<Signout />
				</div>
			</div>
		</div>
	);
};

export default NavBar;
