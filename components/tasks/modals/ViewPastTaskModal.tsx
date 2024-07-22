import React, { useEffect, useState } from "react";
import Modal from "@/components/family/modals/Modal";
import { Task, User } from "@prisma/client";
import TaskForASinglePet from "../TaskForASinglePet";

const ViewPastTaskModal = ({
	isOpen,
	onClose,
	pastTasks,
}: {
	isOpen: boolean;
	onClose: () => void;
	pastTasks: Task[];
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<TaskForASinglePet tasks={pastTasks} />
		</Modal>
	);
};

export default ViewPastTaskModal;
