import React, { useEffect, useState } from "react";
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
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewPet((prev: Pet) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleSubmit = async () => {
		if (file) {
			setUploading(true);
			const formData = new FormData();
			formData.append("file", file);
			formData.append("folder", "pets");
			try {
				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});
				const data = await response.json();
				console.log(`data ${JSON.stringify(data)}`);

				const pet = newPet;
				pet.image = data.s3Url;
				setNewPet(pet);
				setUploading(false);
				await onConfirm();
				onClose();
				setFile(null);
			} catch (error) {
				console.error("Error uploading file:", error);
				setUploading(false);
			}
		} else {
			onConfirm();
			onClose();
		}
	};

	const formatDate = (date: string | Date): string => {
		if (typeof date === "string") {
			return date;
		} else {
			return date.toISOString().split("T")[0];
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				setFile(null);
				onClose();
			}}
		>
			<h2 className="text-xl font-bold mb-4">
				{newPet?.id ? "Edit Pet" : "Create New Pet"}
			</h2>
			<h1>Pet Name:</h1>
			<input
				type="text"
				name="name"
				value={newPet.name || ""}
				onChange={handleChange}
				className="border p-2 mb-4 w-full"
				placeholder="Pet Name"
			/>
			<h1>Pet Photo:</h1>
			<input
				type="file"
				name="image"
				onChange={handleFileChange}
				className="border p-2 mb-4 w-full"
				accept="image/*"
			/>
			<h1>Date of Birth (DOB)</h1>
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
				onClick={async () => {
					await handleSubmit();
				}}
				disabled={uploading}
			>
				{uploading ? "Uploading..." : newPet?.id ? "Update Pet" : "Create Pet"}
			</button>
		</Modal>
	);
};

export default CreatePetModal;
