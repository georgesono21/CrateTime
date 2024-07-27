import { Task, TaskStatus, User } from "@prisma/client";
import React, { useState } from "react";
import MiniUserProfileView from "../user/MiniUserProfileView";
import {
	deleteTask,
	editTask,
	updateTaskStatus,
} from "@/app/api/task/prismaActions";
import CompleteTaskModal from "./modals/CompleteTaskModal";
import EditTaskModal from "./modals/EditTaskModal";

export const isPhotoRequired = (provideProof: Boolean) => {
	return provideProof ? "Yes" : "No";
};

const prettyPrintStatus = (status: TaskStatus) => {
	let color: string;
	let text: string;

	switch (status) {
		case "COMPLETED":
			color = "green";
			text = "Completed";
			break;
		case "OPEN":
			color = "blue";
			text = "Open";
			break;
		case "IN_PROGRESS":
			color = "orange";
			text = "In Progress";
			break;
		case "CANCELLED":
			color = "red";
			text = "Cancelled";
			break;
		default:
			color = "gray";
			text = "Unknown Status";
			break;
	}

	return <div style={{ color }}>{text}</div>;
};

export const TaskStatusComponent = ({ status }: { status: TaskStatus }) => {
	return (
		<div className="flex-row flex gap-2">
			<p className="font-bold"> Status:</p>
			{prettyPrintStatus(status)}
		</div>
	);
};

export const prettyPrintDeadline = (deadline: Date) => {
	return deadline.toLocaleString();
};

const TasksForASinglePetDisplay = ({ tasks }: { tasks: any[] }) => {
	const [completeTaskModalOpen, setCompleteTaskModalOpen] = useState(false);
	const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<any>({
		id: "",
		title: "",
		desc: "",
		deadline: new Date(),
		createdAt: new Date(),
		updatedAt: new Date(),
		familyId: "",
		userId: "",
		petId: "",
		creatorId: "",
		status: "COMPLETED",
		ignore: [],
		provideProof: false,
		image: "",
	});

	const closeModal = () => {
		setCompleteTaskModalOpen(false);
		setEditTaskModalOpen(false);
		setSelectedTask({
			id: "",
			title: "",
			desc: "",
			deadline: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
			familyId: "",
			userId: "",
			petId: "",
			creatorId: "",
			status: "COMPLETED",
			ignore: [],
			provideProof: false,
			image: "",
		});
	};

	const handleEdit = () => {
		console.log(`handleEdit ${JSON.stringify(selectedTask)}`);

		editTask(
			selectedTask.petId,
			selectedTask.familyId,
			selectedTask.userId,
			selectedTask.creatorId,
			selectedTask
		);

		setSelectedTask({
			id: "",
			title: "",
			desc: "",
			deadline: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
			familyId: "",
			userId: "",
			petId: "",
			creatorId: "",
			status: "COMPLETED",
			ignore: [],
			provideProof: false,
			image: "",
		});
		return;
	};

	return (
		<div className="flex flex-col space-y-4">
			{tasks.map((task, index) => (
				<div
					key={index}
					className="p-4 rounded shadow-md border mb-4 dark:bg-gray-800 dark:border-gray-700"
				>
					<>
						<h2 className="text-2xl font-semibold">{task.title}</h2>
						<p className="mb-5">{task.desc}</p>
						<div>
							<TaskStatusComponent status={task.status} />
						</div>
						<p className="flex gap-2">
							<strong>Deadline:</strong>
							{prettyPrintDeadline(new Date(task.deadline))}
						</p>
						<p className="flex gap-2">
							<strong> Suggested Time Outside:</strong>
							{task.suggestedTimeOutside} minutes
						</p>

						<p className="flex gap-2">
							<strong>Photo Required:</strong>
							{isPhotoRequired(task.provideProof)}
						</p>

						<div className="flex mt-4">
							<div>
								<strong>Created By:</strong>
								<MiniUserProfileView user={task.creator[0]} />
							</div>
							<div className="ml-10">
								<strong>Assigned To:</strong>
								<MiniUserProfileView user={task.user[0]} />
							</div>
						</div>
						<div className="flex-wrap gap-5">
							{task.status == "OPEN" ? (
								<button
									className="btn  dark:text-white dark:bg-blue-600 dark:hover:bg-blue-700"
									onClick={() => {
										updateTaskStatus(task, "IN_PROGRESS");
									}}
								>
									Start Task
								</button>
							) : (
								<button
									className="btn  dark:text-white dark:bg-green-600 dark:hover:bg-green-700"
									onClick={() => {
										setSelectedTask(task);
										setCompleteTaskModalOpen(true);
									}}
								>
									Complete Task!
								</button>
							)}
							<button
								onClick={() => {
									setSelectedTask(task);
									setEditTaskModalOpen(true);
								}}
								className="btn  dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600 mx-4"
							>
								Edit Task
							</button>
							<button
								className="btn  dark:text-white dark:bg-red-600 dark:hover:bg-red-700 "
								onClick={() => {
									updateTaskStatus(task, "CANCELLED");
								}}
							>
								Cancel Active Task
							</button>
						</div>
					</>
				</div>
			))}

			<CompleteTaskModal
				isOpen={completeTaskModalOpen}
				onClose={closeModal}
				onConfirm={() => {
					return;
				}}
				newTask={selectedTask}
				setNewTask={setSelectedTask}
			/>

			<EditTaskModal
				isOpen={editTaskModalOpen}
				onClose={closeModal}
				onConfirm={() => {
					handleEdit();
					closeModal();
				}}
				setNewTask={setSelectedTask}
				newTask={selectedTask}
			/>
		</div>
	);
};

export default TasksForASinglePetDisplay;
