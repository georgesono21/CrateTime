import React, { useEffect, useState } from "react";
import Modal from "@/components/family/modals/Modal";
import { Task, User } from "@prisma/client";

const CreateTaskModal = ({
	isOpen,
	onClose,
	onConfirm,
	newTask,
	setNewTask,
	familyId,
	familyMembers,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	newTask: Task;
	setNewTask: React.Dispatch<React.SetStateAction<Task>>;
	familyId: string;
	familyMembers: { [key: string]: User[] };
}) => {
	const [isAssigneeSelected, setIsAssigneeSelected] = useState(true);
	const [isValidDeadline, setIsValidDeadline] = useState(true);
	const [isTitleValid, setIsTitleValid] = useState(true);

	useEffect(() => {
		console.log(
			`createtaskmodal familyMembers ${JSON.stringify(familyMembers)}`
		);
	}, [familyMembers]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value, type } = e.target;
		if (type === "checkbox") {
			const checked = (e.target as HTMLInputElement).checked;
			setNewTask((prev: Task) => ({
				...prev,
				[name]: checked,
			}));
		} else {
			setNewTask((prev: Task) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const formatDate = (date: string | Date): string => {
		if (typeof date === "string") {
			return date;
		} else {
			return date.toISOString().split("T")[0];
		}
	};

	const handleConfirm = () => {
		const today = new Date().toISOString().split("T")[0];
		const deadlineDate = newTask.deadline
			? new Date(newTask.deadline).toISOString().split("T")[0]
			: "";

		if (!newTask.title) {
			setIsTitleValid(false);
			return;
		}

		if (!newTask.userId) {
			setIsAssigneeSelected(false);
			return;
		}

		if (newTask.deadline && deadlineDate < today) {
			setIsValidDeadline(false);
			return;
		}

		setIsTitleValid(true);
		setIsAssigneeSelected(true);
		setIsValidDeadline(true);
		onConfirm();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
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
			{!isTitleValid && (
				<p className="text-red-500">Task title cannot be empty.</p>
			)}

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
			{!isValidDeadline && (
				<p className="text-red-500">Deadline cannot be in the past.</p>
			)}

			<h1>Assign to:</h1>
			<select
				name="userId"
				value={newTask.userId || ""}
				onChange={handleChange}
				className="border p-2   mb-4 w-full"
			>
				<option value="">Select Assignee</option>
				{familyMembers[familyId] &&
					familyMembers[familyId].map((user: any, index) => (
						<option key={index} value={user._id}>
							{user.name}
						</option>
					))}
			</select>
			{!isAssigneeSelected && (
				<p className="text-red-500">Please select an assignee.</p>
			)}
			<div>
				<div className="flex items-center ">
					<h1 className="mr-5 text-center">Provide Proof?</h1>
					<input
						type="checkbox"
						name="provideProof"
						checked={newTask.provideProof || false}
						onChange={handleChange}
						className="border "
					/>
				</div>
				<p className="text-xs mb-4">(assignee uploads a photo of completion)</p>
			</div>

			<button
				className="bg-green-500 text-white px-4 py-2 rounded"
				onClick={handleConfirm}
			>
				Create Task
			</button>
		</Modal>
	);
};

export default CreateTaskModal;
