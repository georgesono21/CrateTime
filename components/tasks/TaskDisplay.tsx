import React from "react";
import TasksForASinglePetDisplay from "./TaskForASinglePet";
import { Task, TasksForAPet } from "../models";

const TaskDisplay = ({ petTasks }: { petTasks: TasksForAPet[] }) => {
	return (
		<div className="flex flex-col space-y-4">
			{petTasks.map((pet, index) => (
				<div key={index}>
					<h1 className="text-3xl pb-3">{pet.name}</h1>
					<TasksForASinglePetDisplay tasks={pet.tasks as Task[]} />
				</div>
			))}
		</div>
	);
};

export default TaskDisplay;
