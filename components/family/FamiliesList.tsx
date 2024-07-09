"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
	deleteFamily,
	retrieveFamilyMembers,
	retrieveUserFamilies,
} from "@/app/api/family/actions";
import { Family, User } from "@prisma/client";

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
	return (
		isOpen && (
			<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
				<div className="bg-base-100 p-6 rounded-lg shadow-lg relative w-96">
					<button
						className="absolute top-2 right-2 text-xl font-bold"
						onClick={onClose}
					>
						&times;
					</button>
					{children}
				</div>
			</div>
		)
	);
};

const FamilyList = () => {
	const [families, setFamilies] = useState<Family[]>([]);
	const [editingFamily, setEditingFamily] = useState<Family | null>(null);
	const [familyMembers, setFamilyMembers] = useState<{ [key: string]: User[] }>(
		{}
	);
	const [newFamilyName, setNewFamilyName] = useState<string>("");

	const { data: session } = useSession();

	useEffect(() => {
		const fetchFamilies = async () => {
			if (session?.user?.id) {
				try {
					const fetchedFamilies = await retrieveUserFamilies(session.user.id);
					setFamilies(fetchedFamilies);
				} catch (error) {
					console.error("Failed to retrieve families:", error);
				}
			}
		};

		fetchFamilies();
	}, [session?.user?.id]);

	const fetchFamilyMembers = async (familyId: string) => {
		try {
			const members = await retrieveFamilyMembers(familyId);
			setFamilyMembers((prevMembers) => ({
				...prevMembers,
				[familyId]: members,
			}));
		} catch (error) {
			console.error(
				`Failed to retrieve members for family ${familyId}:`,
				error
			);
		}
	};

	useEffect(() => {
		families.forEach((family) => {
			fetchFamilyMembers(family.id);
		});
	}, [families]);

	const handleDelete = async (id: string) => {
		deleteFamily(id);
		setFamilies(families.filter((family) => family.id !== id));
	};

	const handleEdit = (family: Family) => {
		setEditingFamily(family);
		setNewFamilyName(family.name);
	};

	const handleUpdate = (id: string) => {
		fetch(`/api/families/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: newFamilyName }),
		})
			.then((response) => response.json())
			.then((updatedFamily: Family) => {
				setFamilies(
					families.map((family) => (family.id === id ? updatedFamily : family))
				);
				setEditingFamily(null);
				setNewFamilyName("");
			})
			.catch((error) => console.error("Error updating family:", error));
	};

	const closeModal = () => {
		setEditingFamily(null);
	};

	return (
		<div className="p-8">
			<ul>
				{families.map((family) => (
					<li className="border p-4 mb-4 rounded-lg shadow-sm" key={family.id}>
						<h2 className="text-xl font-semibold mb-2">{family.name}</h2>
						<p className="text-sm mb-2">
							Created At: {new Date(family.createdAt).toLocaleString()}
						</p>
						<p className="text-sm mb-4">
							Updated At: {new Date(family.updatedAt).toLocaleString()}
						</p>
						<h3 className="font-semibold mb-2">Members:</h3>
						<ul className="list-disc list-inside">
							{/* You can render family members here */}
							{familyMembers[family.id]?.map((member) => (
								<li key={member.id}>{member.name}</li>
							))}
						</ul>
						<div className="flex mb-4">
							<button
								className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
								onClick={() => handleEdit(family)}
							>
								Edit
							</button>
							<button
								className="bg-red-500 text-white px-4 py-2 rounded"
								onClick={() => handleDelete(family.id)}
							>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>

			{/* Modal for editing family */}
			<Modal isOpen={editingFamily !== null} onClose={closeModal}>
				<h2 className="text-xl font-bold mb-4">Edit Family</h2>
				<input
					type="text"
					value={newFamilyName}
					onChange={(e) => setNewFamilyName(e.target.value)}
					className="border p-2 mb-4 w-full"
				/>
				<button
					className="bg-green-500 text-white px-4 py-2 rounded"
					onClick={() => handleUpdate(editingFamily?.id || "")}
				>
					Save
				</button>
			</Modal>
		</div>
	);
};

export default FamilyList;
