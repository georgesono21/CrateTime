import React from "react";
import Modal from "@/components/family/modals/Modal";
import { Pet } from "@prisma/client";

const CreatePetModal = ({
	isOpen,
	onClose,
	onConfirm,
	newPet,
	setNewPet,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	newPet: Pet;
	setNewPet: React.Dispatch<React.SetStateAction<Pet>>;
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewPet((prev: Pet) => ({ ...prev, [name]: value }));
	};

	const formatDate = (date: Date): string => {
		const ISODate = date.toISOString();

		const formattedDate = ISODate.split("T")[0]; // Splitting on 'T' and taking the first part (the date part)
		return formattedDate;
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">
				{newPet?.id ? "Edit Pet" : "Create New Pet"}
			</h2>
			<h1> Pet Name: </h1>
			<input
				type="text"
				name="name"
				value={newPet.name || ""}
				onChange={handleChange}
				className="border p-2 mb-4 w-full"
				placeholder="Pet Name"
			/>
			<h1> Pet Photo: </h1>
			<input
				type="text"
				name="image"
				value={newPet.image || ""}
				onChange={handleChange}
				className="border p-2 mb-4 w-full"
				placeholder="Image URL"
			/>

			<h1> Date of Birth (DOB)</h1>
			<input
				type="date"
				name="dateOfBirth"
				value={formatDate(newPet.dateOfBirth) || ""}
				onChange={handleChange}
				className="border p-2 mb-4 w-full"
				placeholder="Date of Birth"
			/>
			<button
				className="bg-green-500 text-white px-4 py-2 rounded"
				onClick={() => {
					onConfirm();
					onClose();
				}}
			>
				{newPet?.id ? "Update Pet" : "Create Pet"}
			</button>
		</Modal>
	);
};

export default CreatePetModal;
