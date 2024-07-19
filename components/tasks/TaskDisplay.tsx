import React, { useEffect, useState } from "react";
import TasksForASinglePetDisplay from "./TaskForASinglePet";
import { TasksForAPet } from "../models";
import CreateTaskModal from "./modals/CreateTaskModal";
import { Task, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import PetPhotoNameDisplay from "@components/pets/PetPhotoNameDisplay";

const TaskDisplay = ({
	petTasks,
	familyId,
}: {
	petTasks: TasksForAPet[];
	familyId: string;
}) => {
	const { data: session } = useSession();

	const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
	const [newTask, setNewTask] = useState<Task>({
		id: "",
		title: "",
		desc: "",
		deadline: new Date(),
		createdAt: new Date(),
		updatedAt: new Date(),
		familyId: "",
		userId: "",
		petId: "",
		status: "COMPLETED",
	});
	const [uId, setUId] = useState("");
	const [currentUserId, setCurrentUserId] = useState("");
	const [allTasks, setAllTasks] = useState<Task[]>([]);

	const handleCreate = () => {
		return;
	};

	useEffect(() => {
		setUId(session?.user.id || "");
	}, [session]);

	const closeModal = () => {
		setCreateTaskModalOpen(false);
		setNewTask({
			id: "",
			title: "",
			desc: "",
			deadline: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
			familyId: "",
			userId: "",
			petId: "",
			status: "COMPLETED",
		});
	};

	return (
		<div className="flex flex-col space-y-4">
			{petTasks.map((pet, index) => (
				<div key={index} className="border">
					<div className="flex justify-between  m-4">
						<h1 className="text-3xl pb-3">{pet.name}</h1>
						<button
							className=" ml-5 btn btn-primary dark:text-white"
							onClick={() => {
								setCreateTaskModalOpen(true);
							}}
						>
							{" "}
							Create new task
						</button>
					</div>

					{/* <TasksForASinglePetDisplay tasks={pet.tasks as Task[]} /> */}
				</div>
			))}
			<CreateTaskModal
				isOpen={createTaskModalOpen}
				onClose={closeModal}
				onConfirm={handleCreate}
				setNewTask={setNewTask}
				newTask={newTask}
				familyId={familyId}
			/>
		</div>
	);
};

export default TaskDisplay;
function extractUIDFromURL() {
	throw new Error("Function not implemented.");
}
