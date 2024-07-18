import { updateUserDocument } from "@/app/api/user/actions";
import React, { ChangeEvent, FormEvent, useState } from "react";

interface EditProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	editingField: string;
	editedValue: string;
	onSave: () => void;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	user: any;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
	isOpen,
	onClose,
	editingField,
	editedValue,
	onSave,
	onChange,
	user,
}) => {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);

	if (!isOpen) return null;

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleSubmit = async () => {
		if (!file) return;

		setUploading(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("folder", "user");

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			console.log(`handleSubmit: ${data.s3Url}`);

			const updatedUser = await updateUserDocument(user.id, {
				["image"]: data.s3Url,
			});

			setUploading(false);
		} catch (error) {
			console.log(error);
			setUploading(false);
		}
	};

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

						<input type="file" accept="image/*" onChange={handleFileChange} />
					</>
				)}

				{editingField === "image" && (
					<button
						className="bg-green-500 text-white px-4 py-2 rounded mt-5"
						type="submit"
						disabled={!file || uploading}
						onClick={async (e) => {
							await handleSubmit();
							onSave();
							onClose();
						}}
					>
						{uploading ? "Uploading..." : "Upload"}
					</button>
				)}

				{editingField === "name" && (
					<button
						className="bg-green-500 text-white px-4 py-2 rounded mt-5"
						type="submit"
						onClick={() => onSave()}
					>
						Save
					</button>
				)}
			</div>
		</div>
	);
};

export default EditProfileModal;
