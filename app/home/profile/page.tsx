"use client";
import EditProfileModal from "@/components/user/EditProfileModal";
import React, { useState } from "react";

// Functional component for Edit Profile Modal

const Profile = () => {
	// Mock user data for demonstration
	const [user, setUser] = useState({
		name: "John Doe",
		profilePhoto: "https://example.com/profile.jpg",
		dateJoined: "2023-01-01",
		families: ["Family A", "Family B"],
	});

	// State variables for modal
	const [isModalOpen, setModalOpen] = useState(false);
	const [editingField, setEditingField] = useState("");
	const [editedValue, setEditedValue] = useState("");

	// Function to open modal for editing a specific field
	const openModal = (field, value) => {
		setEditingField(field);
		setEditedValue(value);
		setModalOpen(true);
	};

	// Function to handle saving edited field (mock example)
	const saveField = (newValue) => {
		setUser((prevUser) => ({
			...prevUser,
			[editingField]: newValue,
		}));
		setModalOpen(false);
	};

	// Function to handle saving edited profile photo URL
	const saveProfilePhoto = (newPhotoUrl) => {
		// setUser((prevUser) => ({
		// 	...prevUser,
		// 	profilePhoto: newPhotoUrl,
		// }));
		// setModalOpen(false);
	};

	// Handler for input change in the modal
	const handleInputChange = (e) => {
		setEditedValue(e.target.value);
	};

	return (
		<div className="bg-base-300 flex min-h-screen flex-col items-center p-10">
			<h1 className="text-3xl font-semibold mb-4">Profile Overview</h1>
			<div className="max-w-md bg-base-100 rounded-lg shadow-md overflow-hidden mx-auto">
				{/* Apply rounded-lg class to make the profile photo a rectangle wx`ith rounded corners */}
				<img
					src={user.profilePhoto}
					alt="Profile"
					className="w-64 h-64 object-cover rounded-lg border mx-auto m-8"
				/>
				<div className="p-6">
					<h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
					<p className="text-sm text-gray-600 mb-2">
						Joined: {new Date(user.dateJoined).toLocaleDateString()}
					</p>
					<h3 className="text-lg font-semibold mb-2">Families:</h3>
					<ul>
						{user.families.map((family, index) => (
							<li key={index} className="mb-1">
								{family}
							</li>
						))}
					</ul>
					<button
						className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						onClick={() => openModal("name", user.name)}
					>
						Edit Name
					</button>
					<button
						className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
						onClick={() => openModal("profilePhoto", user.profilePhoto)}
					>
						Edit Profile Photo
					</button>
				</div>
			</div>

			{/* Modal for editing fields */}
			<EditProfileModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
				editingField={editingField}
				editedValue={editedValue}
				onSave={() => {
					if (editingField === "name") {
						saveField(editedValue);
					} else if (editingField === "profilePhoto") {
						saveProfilePhoto(editedValue);
					}
				}}
				onChange={handleInputChange}
			/>
		</div>
	);
};

export default Profile;
