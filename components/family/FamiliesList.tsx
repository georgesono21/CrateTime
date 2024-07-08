"use client";
import React, { useEffect, useState } from "react";

interface User {
	id: string;
	name: string;
}

interface Family {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	familyMembers: User[];
}
const mockFamilies: Family[] = [
	{
		id: "1",
		name: "Smith Family",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		familyMembers: [
			{ id: "1", name: "John Smith" },
			{ id: "2", name: "Jane Smith" },
		],
	},
	{
		id: "2",
		name: "Doe Family",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		familyMembers: [
			{ id: "3", name: "John Doe" },
			{ id: "4", name: "Jane Doe" },
		],
	},
];

const FamilyList: React.FC = () => {
	const [families, setFamilies] = useState<Family[]>(mockFamilies);
	const [editingFamilyId, setEditingFamilyId] = useState<string | null>(null);
	const [newFamilyName, setNewFamilyName] = useState<string>("");

	useEffect(() => {
		fetch("/api/families")
			.then((response) => response.json())
			.then((data: Family[]) => setFamilies(data))
			.catch((error) => console.error("Error fetching families:", error));
	}, []);

	const handleDelete = (id: string) => {
		fetch(`/api/families/${id}`, { method: "DELETE" })
			.then(() => setFamilies(families.filter((family) => family.id !== id)))
			.catch((error) => console.error("Error deleting family:", error));
	};

	const handleEdit = (id: string, name: string) => {
		setEditingFamilyId(id);
		setNewFamilyName(name);
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
				setEditingFamilyId(null);
				setNewFamilyName("");
			})
			.catch((error) => console.error("Error updating family:", error));
	};

	return (
		<div>
			<h1>Family List</h1>
			<ul>
				{families.map((family) => (
					<li className="border p-10 m-5" key={family.id}>
						{editingFamilyId === family.id ? (
							<>
								<input
									type="text"
									value={newFamilyName}
									onChange={(e) => setNewFamilyName(e.target.value)}
								/>
								<button onClick={() => handleUpdate(family.id)}>Save</button>
							</>
						) : (
							<>
								<h2>{family.name}</h2>
								<button onClick={() => handleEdit(family.id, family.name)}>
									Edit
								</button>
							</>
						)}
						<button onClick={() => handleDelete(family.id)}>Delete</button>
						<p>Created At: {new Date(family.createdAt).toLocaleString()}</p>
						<p>Updated At: {new Date(family.updatedAt).toLocaleString()}</p>
						<h3>Members:</h3>
						<ul>
							{family.familyMembers.map((member) => (
								<li key={member.id}>{member.name}</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</div>
	);
};

export default FamilyList;
