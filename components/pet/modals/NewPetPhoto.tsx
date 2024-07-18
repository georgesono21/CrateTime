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

	const formatDate = (date: string | Date): string => {
		if (typeof date === "string") {
			return date;
		} else {
			return date.toISOString().split("T")[0];
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Upload Pet Photo</h2>

			<h1> Date of Birth (DOB)</h1>
			<input
				type="date"
				name="dateOfBirth"
				value={newPet.dateOfBirth ? formatDate(newPet.dateOfBirth) : ""}
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
