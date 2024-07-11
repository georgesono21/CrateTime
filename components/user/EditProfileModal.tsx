import React from "react";

interface EditProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	editingField: string;
	editedValue: string;
	onSave: () => void;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
	isOpen,
	onClose,
	editingField,
	editedValue,
	onSave,
	onChange,
}) => {
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
				{editingField === "name" && (
					<>
						<h2 className="text-xl font-bold mb-4">Edit Name</h2>
						<input
							type="text"
							value={editedValue}
							onChange={onChange}
							className="border p-2 mb-4 w-full"
							placeholder={`Enter new ${editingField}`}
						/>
					</>
				)}
				{editingField === "image" && (
					<>
						<h2 className="text-xl font-bold mb-4">Edit Profile Photo</h2>
						<input
							type="text"
							value={editedValue}
							onChange={onChange}
							className="border p-2 mb-4 w-full"
							placeholder="Enter new profile photo URL"
						/>
					</>
				)}
				<button
					className="bg-green-500 text-white px-4 py-2 rounded"
					onClick={onSave}
				>
					Save
				</button>
			</div>
		</div>
	);
};

export default EditProfileModal;
