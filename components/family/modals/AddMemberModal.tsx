import React from "react";
import Modal from "./Modal";

const AddMemberModal = ({
	isOpen,
	onClose,
	onConfirm,
	memberEmail,
	setMemberEmail,
}: {
	isOpen: any;
	onClose: any;
	onConfirm: any;
	memberEmail: string;
	setMemberEmail: any;
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Add New Member</h2>
			<input
				type="email"
				value={memberEmail}
				onChange={(e) => setMemberEmail(e.target.value)}
				className="border p-2 mb-4 w-full"
				placeholder="Member Email"
			/>
			<button
				className="bg-green-500 text-white px-4 py-2 rounded"
				onClick={onConfirm}
			>
				Send Invitation
			</button>
		</Modal>
	);
};

export default AddMemberModal;
