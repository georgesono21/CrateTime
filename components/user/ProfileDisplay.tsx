"use client";

import EditProfileModal from "@/components/user/EditProfileModal";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Family, User } from "@prisma/client";
import {
	getUserDocumentById,
	updateUserDocument,
	deleteAccount, // Import deleteAccount function
} from "@/app/api/user/actions";
import DeleteProfileModal from "@/components/user/DeleteProfileModal"; // Assuming you have a DeleteProfileModal component
import { usePathname, useSearchParams } from "next/navigation";

interface ProfileUser extends User {
	families: Family[];
}

const ProfileDisplay = () => {
	const { data: session } = useSession();
	const [user, setUser] = useState<ProfileUser | null>(null);

	// State variables for modals and editing
	const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
	const [isDeleteProfileModalOpen, setDeleteProfileModalOpen] = useState(false);
	const [editingField, setEditingField] = useState("");
	const [editedValue, setEditedValue] = useState("");
	const [uId, setUId] = useState("");

	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Fetch user data on session change or initial load
	useEffect(() => {
		extractUIDFromURL();
		retrieveUser(uId);
	}, [uId]);

	const extractUIDFromURL = () => {
		const url = `${pathname}?${searchParams}`;
		const queryString = url.split("?")[1];
		if (!queryString) return null;

		const params = new URLSearchParams(queryString);
		setUId(params.get("uid") || "");
	};

	// Retrieve user data function
	const retrieveUser = async (userId: string) => {
		if (userId) {
			try {
				const currentUserDocument = await getUserDocumentById(userId);
				setUser(currentUserDocument as ProfileUser);
				console.log(`Retrieve User: ${uId} ${user}`);
			} catch (error) {
				console.error("Error retrieving user:", error);
			}
		}
	};

	// Function to handle saving edited field
	const saveField = async (newValue: string) => {
		if (user) {
			console.log(`new value ${newValue}`);

			try {
				if (editingField == "name") {
					const updatedUser = await updateUserDocument(user.id, {
						[editingField]: newValue,
					});
				}
				await retrieveUser(user.id);
			} catch (error) {
				console.error("Error updating user:", error);
			}
		}
		setEditProfileModalOpen(false);
	};

	// Function to handle deleting the user account
	const handleDeleteAccount = async () => {
		if (user && user.id) {
			try {
				await deleteAccount(user.id);
			} catch (error) {
				console.error("Error deleting account:", error);
			}
		}
		setDeleteProfileModalOpen(false);
		await signOut();
	};

	// Function to handle input change in the modal
	const handleInputChange = (e: { target: { value: string } }) => {
		setEditedValue(e.target.value);
	};

	// Function to open modal for editing a specific field
	const openModal = (
		field: React.SetStateAction<string>,
		value: React.SetStateAction<string> | null
	) => {
		setEditingField(field);
		setEditedValue(value || "");
		setEditProfileModalOpen(true);
	};

	// Function to close all modals
	const closeModals = () => {
		setEditProfileModalOpen(false);
		setDeleteProfileModalOpen(false);
	};

	return (
		<div className="bg-base-300 flex min-h-screen flex-col items-center p-10">
			<h1 className="text-3xl font-semibold mb-4">Profile Overview</h1>
			<div className="max-w-md bg-base-100 rounded-lg shadow-md overflow-hidden mx-auto">
				{/* Profile Photo */}
				<img
					src={user?.image || ""}
					alt="Profile"
					className="w-64 h-64 object-cover rounded-lg border mx-auto m-8"
				/>
				<div className="p-6">
					{/* User Name */}
					<h2 className="text-2xl font-semibold mb-2">{user?.name || ""}</h2>
					{/* Joined Date */}
					<p className="text-sm text-gray-600 mb-2">
						Joined: {new Date(user?.createdAt || "").toLocaleDateString()}
					</p>
					{/* Families List */}
					<h3 className="text-lg font-semibold mb-2">Families:</h3>
					<ul>
						{user?.families.map((family, index) => (
							<li key={index} className="mb-1">
								{family.name}
							</li>
						))}
					</ul>
					{session?.user.id === uId && (
						<div>
							{/* Edit Name Button */}
							<button
								className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								onClick={() => openModal("name", user?.name || "")}
							>
								Edit Name
							</button>
							{/* Edit Profile Photo Button */}
							<button
								className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
								onClick={() => openModal("image", user?.image || "")}
							>
								Edit Profile Photo
							</button>
							{/* Delete Account Button */}
							<button
								className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 ml-2"
								onClick={() => setDeleteProfileModalOpen(true)}
							>
								Delete Account
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Edit Profile Modal */}
			<EditProfileModal
				isOpen={isEditProfileModalOpen}
				onClose={() => closeModals()}
				editingField={editingField}
				editedValue={editedValue}
				onSave={() => {
					saveField(editedValue);
					closeModals();
				}}
				onChange={handleInputChange}
				user={user}
			/>

			{/* Delete Profile Modal */}
			<DeleteProfileModal
				isOpen={isDeleteProfileModalOpen}
				onClose={() => closeModals()}
				onConfirm={handleDeleteAccount}
			/>
		</div>
	);
};

export default ProfileDisplay;
