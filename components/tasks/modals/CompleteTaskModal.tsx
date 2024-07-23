import React, { useEffect, useState } from "react";
import Modal from "@/components/family/modals/Modal";
import { Task, User } from "@prisma/client";
import {
	updateTaskPhoto,
	updateTaskStatus,
} from "@/app/api/task/prismaActions";

const CompleteTaskModal = ({
	isOpen,
	onClose,
	onConfirm,
	newTask,
	setNewTask,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	newTask: Task;
	setNewTask: any;
}) => {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [isUploaded, setIsUploaded] = useState(true);

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

	const handleSubmit = async () => {
		if (file) {
			setUploading(true);
			const formData = new FormData();
			formData.append("file", file);
			formData.append("folder", "tasks");
			try {
				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});
				const data = await response.json();
				console.log(`data ${JSON.stringify(data)}`);

				const task = newTask;
				task.image = data.s3Url;
				setNewTask(task);
				updateTaskPhoto(task, data.s3Url);
				updateTaskStatus(task, "COMPLETED");
				onClose();
				setFile(null);
				setIsUploaded(true);
			} catch (error) {
				console.error("Error uploading file:", error);
				setUploading(false);
				setFile(null);
				setIsUploaded(true);
			}
		} else {
			setIsUploaded(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Complete Task: {newTask.title}</h2>

			{!isUploaded && (
				<p className="text-red-500">
					You must upload a photo as proof of completion.
				</p>
			)}

			<h1>Pet Photo:</h1>
			<input
				type="file"
				name="image"
				onChange={handleFileChange}
				className="border p-2 mb-4 w-full"
				accept="image/*"
			/>

			<button
				className="bg-green-500 text-white px-4 py-2 rounded"
				onClick={handleSubmit}
				disabled={uploading}
			>
				Submit Photo and Finish Task
			</button>
		</Modal>
	);
};

export default CompleteTaskModal;
