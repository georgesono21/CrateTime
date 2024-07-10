import React from "react";
import Modal from "./Modal";

const CreateFamilyModal = ({
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
			<h2 className="text-xl font-bold mb-4">Create New Family</h2>
			<input
				type="text"
				value={familyName}
				onChange={(e) => setFamilyName(e.target.value)}
				className="border p-2 mb-4 w-full"
				placeholder="Family Name"
			/>
			<button
				className="bg-green-500 text-white px-4 py-2 rounded"
				onClick={onConfirm}
			>
				Create
			</button>
		</Modal>
	);
};
export default CreateFamilyModal;
