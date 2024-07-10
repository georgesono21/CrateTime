import React from "react";
import Modal from "./Modal";
import { User } from "@prisma/client";

const ChangeAdminModal = ({
	isOpen,
	onClose,
	onConfirm,
	familyMembers,
	currentAdminId,
	setNewAdminId,
}: {
	isOpen: any;
	onClose: any;
	onConfirm: any;
	familyMembers: User[];
	currentAdminId: string;
	setNewAdminId: any;
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Change Admin</h2>
			<p className="mb-4">Select a new admin from existing family members:</p>
			<select
				className="border p-2 mb-4 w-full"
				onChange={(e) => setNewAdminId(e.target.value)}
			>
				<option value="">Select a new admin</option>
				{familyMembers
					.filter((member) => member.id !== currentAdminId)
					.map((member) => (
						<option key={member.id} value={member.id}>
							{member.name} ({member.email})
						</option>
					))}
			</select>
			<div className="flex justify-end mt-4">
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
					onClick={async () => {
						await onConfirm();
						onClose();
					}}
				>
					Change Admin
				</button>
				<button
					className="bg-gray-500 text-white px-4 py-2 rounded"
					onClick={onClose}
				>
					Cancel
				</button>
			</div>
		</Modal>
	);
};

export default ChangeAdminModal;
