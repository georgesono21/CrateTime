import { Task } from "@prisma/client";
import React, { useEffect, useState } from "react";
import MiniUserProfileView from "../user/MiniUserProfileView";
import { deleteTask, updateTaskStatus } from "@/app/api/task/prismaActions";
import {
	isPhotoRequired,
	prettyPrintDeadline,
	TaskStatusComponent,
} from "./TaskForASinglePet";

const PastTaskForASinglePetDisplay = ({ tasks }: { tasks: any[] }) => {
	const [cancelTaskModalOpen, setCancelTaskModalOpen] = useState(false);
	const [optimisticTasks, setOptimisticTasks] = useState<any[]>(tasks);

	useEffect(() => {
		// console.log(PastTasksForASinglePetDisplay);
		setOptimisticTasks(tasks);
	}, [tasks]);

	return (
		<div className="flex flex-col space-y-4">
			{optimisticTasks.map((task, index) => (
				<div
					key={index}
					className="p-4 rounded shadow-md border mb-4 dark:bg-gray-800 dark:border-gray-700"
				>
					{task.status == "CANCELLED" || task.status == "COMPLETED" ? (
						<div className="flex flex-col items-start space-y-2">
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

							{task.status == "COMPLETED" && (
								<p className="flex gap-2">
									<strong>Actual Time Spent Outside:</strong>
									{task.timeSpentOutside || 0} minutes
								</p>
							)}

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

							{task.provideProof && (
								<>
									<h1>Photo of Completion</h1>
									<a href={task.image}>
										<img
											src={task.image}
											alt="Invalid Photo"
											className="w-16 h-16 object-cover"
										/>
									</a>
								</>
							)}

							<div className="flex gap-4">
								{task.status != "CANCELLED" && (
									<button
										className="btn  dark:text-white dark:bg-blue-600 dark:hover:bg-blue-700"
										onClick={() => {
											const newOptimisticTasks = optimisticTasks.filter((t) => {
												return t._id !== task._id;
											});

											setOptimisticTasks(newOptimisticTasks);
											updateTaskStatus(task, "OPEN");
										}}
									>
										Move to Active Tasks
									</button>
								)}
								<button
									className="btn  dark:text-white dark:bg-red-600 dark:hover:bg-red-700"
									onClick={() => {
										const newOptimisticTasks = optimisticTasks.filter((t) => {
											return t._id !== task._id;
										});

										setOptimisticTasks(newOptimisticTasks);
										deleteTask(task);
									}}
								>
									Delete{" "}
									{task.status == "CANCELLED" ? <>Cancelled</> : <>Completed</>}{" "}
									Task
								</button>
							</div>
						</div>
					) : null}
				</div>
			))}
		</div>
	);
};

export default PastTaskForASinglePetDisplay;
