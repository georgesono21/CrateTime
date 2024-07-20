import { Task } from "@prisma/client";
import React from "react";
import MiniUserProfileView from "../user/MiniUserProfileView";

const TasksForASinglePetDisplay = ({ tasks }: { tasks: any[] }) => {
	return (
		<div className="flex flex-col space-y-4">
			{tasks.map((task, index) => (
				<div
					key={index}
					className="p-4 rounded shadow-md border mb-4 dark:bg-gray-800 dark:border-gray-700"
				>
					<h2 className="text-2xl font-semibold">{task.title}</h2>
					<p className="mb-5">{task.desc}</p>
					<p>
						<strong>Deadline:</strong> {task.deadline.toString()}
					</p>
					<p>
						<strong>Status:</strong> {task.status}
					</p>
					<p>
						<strong>Assigned To:</strong>{" "}
						<MiniUserProfileView user={task.user[0]} />
					</p>

					<p>
						<strong>Created By:</strong>
						<MiniUserProfileView user={task.creator[0]} />
					</p>
					<div className="flex gap-5">
						<button className="btn  dark:text-white dark:bg-blue-600 dark:hover:bg-blue-700">
							Start Task!
						</button>
						<button className="btn  dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600">
							Edit Task
						</button>
						<button className="btn  dark:text-white dark:bg-red-600 dark:hover:bg-red-700">
							Delete Task
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default TasksForASinglePetDisplay;
