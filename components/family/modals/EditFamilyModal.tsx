import React from "react";
import Modal from "./Modal";
import EditProfileModal from "@/components/user/EditProfileModal";

const EditFamilyModal = ({
	isOpen,
	onClose,
	onConfirm,
	familyName,
	setFamilyName,
}: {
	isOpen: any;
	onClose: any;
	onConfirm: any;
	familyName: string;
	setFamilyName: any;
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Edit Family</h2>
			<input
				type="text"
				value={familyName}
				onChange={(e) => setFamilyName(e.target.value)}
				className="border p-2 mb-4 w-full"
			/>
			<button
				className="bg-green-500 text-white px-4 py-2 rounded"
				onClick={onConfirm}
			>
				Save
			</button>
		</Modal>
	);
};

export default EditFamilyModal;
