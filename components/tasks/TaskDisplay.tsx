import React, { useEffect, useState } from "react";
import { Task, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import CreateTaskModal from "./modals/CreateTaskModal";
import { createTask } from "@/app/api/task/prismaActions";
import PetPhotoNameDisplay from "../pet/PetPhotoNameDisplay";
import PetPhotoNameDisplayMongo from "../pet/PetPhotoNameDisplayMongo";
import TasksForASinglePetDisplay from "./TaskForASinglePet";

const TaskDisplay = ({
	petTasks,
	familyId,
	familyMembers,
}: {
	petTasks: any[];
	familyId: string;
	familyMembers: { [key: string]: User[] };
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
		creatorId: "",
		status: "COMPLETED",
		ignore: [],
	});
	const [uId, setUId] = useState("");

	useEffect(() => {
		setUId(session?.user.id || "");
	}, [session]);

	const handleCreate = () => {
		console.log(`handleCreate ${JSON.stringify(newTask)}`);

		createTask(
			newTask.petId,
			newTask.familyId,
			newTask.userId,
			newTask.creatorId,
			newTask
		);

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
			creatorId: "",
			status: "COMPLETED",
			ignore: [],
		});
		return;
	};

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
			creatorId: "",
			ignore: [],
		});
	};

	return (
		<div className="flex flex-col space-y-4">
			{petTasks.map((pet, index) => (
				<div key={index} className=" p-4 rounded-lg shadow-md">
					<div className="flex items-center mb-4">
						<h1 className="text-xl">
							<PetPhotoNameDisplayMongo pet={pet} />
						</h1>
						<button
							className="btn ml-10 btn-primary dark:text-white"
							onClick={() => {
								setCreateTaskModalOpen(true);

								let newNewTask = {
									...newTask,
									petId: pet._id,
									familyId: familyId,
									creatorId: uId,
								};
								setNewTask(newNewTask);
							}}
						>
							Create new task
						</button>
						<button className="btn ml-10 btn-secondary dark:text-white">
							View Past Tasks
						</button>
					</div>
					<div>
						{pet.tasks.length > 0 ? (
							<TasksForASinglePetDisplay tasks={pet.tasks} />
						) : (
							<p>No tasks available for this pet.</p>
						)}
					</div>
				</div>
			))}
			<CreateTaskModal
				isOpen={createTaskModalOpen}
				onClose={closeModal}
				onConfirm={() => {
					handleCreate();
					closeModal();
				}}
				setNewTask={setNewTask}
				newTask={newTask}
				familyId={familyId}
				familyMembers={familyMembers}
			/>
		</div>
	);
};

export default TaskDisplay;
