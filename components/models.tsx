import { DefaultSession } from "next-auth";

export interface PetCrateTime {
	name: string;
	crateTimeTodayInMinutes: number;
	maxCrateTimeInMinutes: number;
}

export interface ProviderInfo {
	providerName: string;
	displayName: string;
}

export interface Task {
	title: string;
	desc: string;
	deadline: Date;
	suggestedMinTimeOutsideInMins: number;
	status: string;
	assignedTo: string;
}

export interface TasksForAPet {
	id: string;
	name: string;
	tasks: Task[];
}

export interface Pet {
	id: string;
	name: string;
	pfpUrl: string;
}
