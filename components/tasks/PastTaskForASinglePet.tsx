import { Task } from "@prisma/client";
import React, { useEffect, useState } from "react";
import MiniUserProfileView from "../user/MiniUserProfileView";
import { deleteTask, updateTaskStatus } from "@/app/api/task/prismaActions";

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
							<p>
								<strong>Deadline:</strong> {task.deadline}
							</p>
							<p>
								<strong>Status:</strong> {task.status}
							</p>
							<p>
								<strong>Photo Required:</strong>{" "}
								{task.photoProof ? "Yes" : "No"}
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
					) : (
						<>
							<h2 className="text-2xl font-semibold">{task.title}</h2>
							<p className="mb-5">{task.desc}</p>
							<p>
								<strong>Deadline:</strong> {task.deadline}
							</p>
							<p>
								<strong>Status:</strong> {task.status}
							</p>

							<p>
								<strong>Photo Required:</strong>{" "}
								{task.photoProof ? "Yes" : "No"}
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
							<div className="flex gap-5">
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
											updateTaskStatus(task, "COMPLETED");
										}}
									>
										Complete Task!
									</button>
								)}
								<button className="btn  dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600">
									Edit Task
								</button>
								<button
									className="btn  dark:text-white dark:bg-red-600 dark:hover:bg-red-700"
									onClick={() => {
										updateTaskStatus(task, "CANCELLED");
									}}
								>
									Cancel Active Task
								</button>
							</div>
						</>
					)}
				</div>
			))}
		</div>
	);
};

export default PastTaskForASinglePetDisplay;
