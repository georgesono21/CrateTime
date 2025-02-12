import React, { useEffect, useState } from "react";
import { Pet, Task, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import CreateTaskModal from "./modals/CreateTaskModal";
import { createTask } from "@/app/api/task/prismaActions";
import PetPhotoNameDisplay from "../pet/PetPhotoNameDisplay";
import PetPhotoNameDisplayMongo from "../pet/PetPhotoNameDisplayMongo";
import TasksForASinglePetDisplay from "./TaskForASinglePet";
import ViewPastTaskModal from "./modals/ViewPastTaskModal";
import CrateTime from "../pet/CrateTimeDisplay";
import { crateTimeToday } from "@/mockData";

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
	const [viewPastTaskModalOpen, setViewPastTaskModalOpen] = useState(false);
	const [selectedPetTasks, setSelectedPetTasks] = useState<Task[]>([]);
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
		provideProof: false,
		image: "",
		timeSpentOutside: 0,
		suggestedTimeOutside: 0,
	});
	const [uId, setUId] = useState("");

	useEffect(() => {
		setUId(session?.user.id || "");
	}, [session]);

	// useEffect(() => {
	// 	console.log(`selectedPetTasks ${selectedPetTasks}`);
	// }, [selectedPetTasks]);

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
			provideProof: false,
			image: "",
			timeSpentOutside: 0,
			suggestedTimeOutside: 0,
		});
		return;
	};

	const closeModal = () => {
		setCreateTaskModalOpen(false);
		setViewPastTaskModalOpen(false);
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
			provideProof: false,
			image: "",
			timeSpentOutside: 0,
			suggestedTimeOutside: 0,
		});
	};

	return (
		<>
			<h1 className="text-3xl font-semibold mt-8 text-center">Task Overview</h1>
			<div className="flex flex-col">
				{petTasks.map((pet, index) => (
					<div key={index} className=" p-4 rounded-lg shadow-md">
						<div className="flex items-center mb-4">
							<h1 className="text-xl">
								<PetPhotoNameDisplayMongo pet={pet} />
							</h1>
							<div>
								<button
									className="btn ml-10 sm:mb-5  btn-primary dark:text-white"
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
								<button
									className="btn ml-10 btn-secondary dark:text-white"
									onClick={() => {
										setSelectedPetTasks(pet.tasks);
										setViewPastTaskModalOpen(true);
									}}
								>
									View Past Tasks
								</button>
							</div>
						</div>
						<div>
							{pet.tasks.filter((task: any) => {
								return (
									task.status !== "CANCELLED" && task.status !== "COMPLETED"
								);
							}).length > 0 ? (
								<TasksForASinglePetDisplay
									tasks={pet.tasks.filter((task: any) => {
										return (
											task.status !== "CANCELLED" && task.status !== "COMPLETED"
										);
									})}
								/>
							) : (
								<p className="text-gray-400 text-center">
									No active tasks for {pet.name}. Good job!
								</p>
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
				<ViewPastTaskModal
					isOpen={viewPastTaskModalOpen}
					onClose={closeModal}
					// pastTasks={selectedPetTasks.filter((task) => {
					// 	task.status == "COMPLETED" || task.status == "CANCELLED";
					// })}
					pastTasks={selectedPetTasks}
				/>
			</div>
		</>
	);
};

export default TaskDisplay;
