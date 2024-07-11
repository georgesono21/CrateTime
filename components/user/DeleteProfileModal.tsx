const EditProfileModal = ({ isOpen, onClose, onConfirm }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-base-100 p-6 rounded-lg shadow-lg relative w-96">
				<button
					className="absolute top-2 right-2 text-xl font-bold"
					onClick={onClose}
				>
					&times;
				</button>
				<h2 className="text-xl font-bold mb-4">Delete Account</h2>

				<p>Are you sure you want to delete your account?</p>
				<div className="flex justify-end mt-4">
					<button
						className="bg-red-500 text-white px-4 py-2 rounded mr-2 text-xs"
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
			</div>
		</div>
	);
};

export default EditProfileModal;
