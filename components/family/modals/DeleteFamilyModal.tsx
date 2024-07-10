import Modal from "./Modal";

const DeleteFamilyModal = ({
	isOpen,
	onClose,
	onConfirm,
	familyName,
}: {
	isOpen: any;
	onClose: any;
	onConfirm: any;
	familyName: string;
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Delete Family</h2>

			<p>Are you sure you want to delete the family "{familyName}"?</p>
			<div className="flex justify-end mt-4">
				<button
					className="bg-red-500 text-white px-4 py-2 rounded mr-2"
					onClick={() => {
						onConfirm(); // Call onConfirm to handle deletion
						onClose(); // Close the modal after deletion
					}}
				>
					Delete
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

export default DeleteFamilyModal;
