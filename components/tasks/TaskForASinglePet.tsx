import { Task } from "@prisma/client";
import React from "react";

const TasksForASinglePetDisplay = ({ tasks }: { tasks: Task[] }) => {
	return (
		<div className="flex flex-col space-y-4">
			{tasks.map((task, index) => (
				<div key={index} className="p-4 rounded shadow-md border mb-4">
					<h2 className="text-2xl font-semibold">{task.title}</h2>
					<p className="mb-5">{task.desc}</p>
					<p>
						<strong>Deadline:</strong> {task.deadline.toString()}
					</p>
					<p>
						<strong>Status:</strong> {task.status}
					</p>
					<p>
						<strong>Assigned To:</strong> {task.userId}
					</p>
				</div>
			))}
		</div>
	);
};

export default TasksForASinglePetDisplay;
