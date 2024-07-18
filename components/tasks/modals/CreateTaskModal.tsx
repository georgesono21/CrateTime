import React, { useEffect, useState } from "react";
import Modal from "@/components/family/modals/Modal";
import { Task, User } from "@prisma/client";
import { retrieveFamilyMembers } from "@/app/api/family/prismaActions";

const CreateTaskModal = ({
	isOpen,
	onClose,
	onConfirm,
	newTask,
	setNewTask,
	familyId,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	newTask: Task;
	setNewTask: React.Dispatch<React.SetStateAction<Task>>;
	familyId: string;
}) => {
	const [familyMembers, setFamilyMembers] = useState<User[]>([]);

	useEffect(() => {
		fetchFamilyMembers();
	}, [familyId]);

	const fetchFamilyMembers = async () => {
		if (familyId) {
			const newFamilyMembers = await retrieveFamilyMembers(familyId);
			setFamilyMembers(newFamilyMembers);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setNewTask((prev: Task) => ({ ...prev, [name]: value }));
	};

	const formatDate = (date: string | Date): string => {
		if (typeof date === "string") {
			return date;
		} else {
			return date.toISOString().split("T")[0];
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				onClose();
			}}
		>
			<h2 className="text-xl font-bold mb-4">Create New Task</h2>
			<h1>Task Title:</h1>
			<input
				type="text"
				name="title"
				value={newTask.title || ""}
				onChange={handleChange}
				className="border p-2 mb-4 w-full"
				placeholder="Task Title"
			/>

			<h1>Task Description:</h1>
			<input
				type="text"
				name="desc"
				value={newTask.desc || ""}
				onChange={handleChange}
				className="border p-2 mb-4 w-full"
				placeholder="Task Description"
			/>

			<h1>Deadline</h1>
			<input
				type="date"
				name="deadline"
				value={newTask.deadline ? formatDate(newTask.deadline) : ""}
				onChange={handleChange}
				className="border p-2 mb-4 w-full"
				placeholder="Deadline"
			/>

			<h1>Assign to:</h1>
			<select
				name="userId"
				value={newTask.userId || ""}
				onChange={handleChange}
				className="border p-2 mb-4 w-full"
			>
				<option value="">Select Assignee</option>
				{/* {users.map((user) => (
					<option key={user.id} value={user.id}>
						{user.name}
					</option>
				))} */}
			</select>

			<button
				className="bg-green-500 text-white px-4 py-2 rounded"
				onClick={async () => {
					await onConfirm();
				}}
			>
				Create Task
			</button>
		</Modal>
	);
};

export default CreateTaskModal;
