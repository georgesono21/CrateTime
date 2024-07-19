import React from "react";
import Link from "next/link";
import { Pet } from "@prisma/client";

const PetPhotoNameDisplay = ({ pet }: { pet: Pet }) => {
	console.log(pet);
	return (
		// <Link href={`/pets/${pet.id}`}>
		<div className="flex items-center m-3">
			<img
				src={
					pet.image ||
					"https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjc3LTAxOTYtcC1sMTRvZnBpNy5wbmc.png"
				}
				className="rounded-full w-12 h-12 mr-4"
			/>
			<div>
				<div>{pet.name}</div>
				<div>
					Date of Birth: {new Date(pet.dateOfBirth).toLocaleDateString()}
				</div>
			</div>
		</div>
		// </Link>
	);
};

export default PetPhotoNameDisplay;
