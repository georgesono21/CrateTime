import React from "react";

export interface Task {
	title: string;
	desc: string;
	deadline: Date;
	suggestedMinTimeOutsideInMins: number;
	status: string;
	assignedTo: string;
}

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
						<strong>Suggested Time Outside:</strong>{" "}
						{task.suggestedMinTimeOutsideInMins} mins
					</p>
					<p>
						<strong>Status:</strong> {task.status}
					</p>
					<p>
						<strong>Assigned To:</strong> {task.assignedTo}
					</p>
				</div>
			))}
		</div>
	);
};

export default TasksForASinglePetDisplay;
