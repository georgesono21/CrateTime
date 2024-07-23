import React, { useEffect, useState } from "react";
import { Task, User } from "@prisma/client";
import PastTaskForASinglePet from "../PastTaskForASinglePet";

const Modal = ({
	isOpen,
	onClose,
	children,
}: {
	isOpen: any;
	onClose: any;
	children: React.ReactNode;
}) => {
	return (
		isOpen && (
			<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
				<div className="min-w-80 mt-20 p-5 bg-base-100 rounded-lg shadow-lg relative max-h-full w-full md:w-auto overflow-y-auto">
					<button
						className="absolute top-2 right-2 text-xl font-bold"
						onClick={onClose}
					>
						&times;
					</button>
					{children}
				</div>
			</div>
		)
	);
};

const ViewPastTaskModal = ({
	isOpen,
	onClose,
	pastTasks,
}: {
	isOpen: boolean;
	onClose: () => void;
	pastTasks: Task[];
}) => {
	const [shownPastTasks, setShownPastTasks] = useState<Task[]>([]);

	useEffect(() => {
		const newPastTasks = pastTasks.filter((task) => {
			return task.status === "COMPLETED" || task.status === "CANCELLED";
		});
		// console.log(JSON.stringify(newPastTasks));
		setShownPastTasks(newPastTasks);
	}, [pastTasks]);

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h1 className="text-center text-2xl font-bold mb-5">Past Tasks</h1>
			<PastTaskForASinglePet tasks={shownPastTasks} />

			{shownPastTasks.length == 0 && (
				<h1 className="text-center text-gray-400">No past tasks yet.</h1>
			)}
		</Modal>
	);
};

export default ViewPastTaskModal;
