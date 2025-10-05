// Gloomhaven: Jaws of the Lion Tracker Types

export interface Character {
	id: string;
	name: string;
	class: CharacterClass;
	level: number;
	experience: number;
	gold: number;
	checkmarks: number;
	perks: string[];
	items: string[]; // Changed to simple string array for Jaws of the Lion
	equipment?: {
		head?: string;
		body?: string;
		legs?: string;
		feet?: string;
	};
	abilities?: string; // Special abilities or unlocked cards
	notes: string;
	createdAt: Date;
	updatedAt: Date;
	// Removed campaignId - characters are now independent
}

export interface CharacterClass {
	id: string;
	name: string;
	symbol: string; // The class symbol/icon
	color: string; // Primary color for the class
	maxLevel: number;
}

export interface Item {
	id: string;
	name: string;
	type: "head" | "body" | "legs" | "one-hand" | "two-hand" | "small-item";
	cost: number;
	description: string;
	equipped: boolean;
}

export interface Scenario {
	id: string;
	number: number;
	name: string;
	description: string;
	requirements: string[];
	rewards: string[];
	completed: boolean;
	completedAt?: Date;
	notes: string;
}

export interface Campaign {
	id: string;
	name: string;
	description: string;
	groupName: string;
	characters: string[]; // Array of character IDs instead of full Character objects
	scenarios: Scenario[];
	currentScenario?: number;
	prosperity: number;
	reputation: number;
	createdAt: Date;
	updatedAt: Date;
	notes: string;
}

export interface CampaignSummary {
	id: string;
	name: string;
	groupName: string;
	characterCount: number;
	completedScenarios: number;
	totalScenarios: number;
	lastPlayed?: Date;
	createdAt: Date;
}

// Gloomhaven: Jaws of the Lion specific data
export const CHARACTER_CLASSES: CharacterClass[] = [
	{id: "hatchet", name: "Hatchet", symbol: "🎯", color: "#8B4513", maxLevel: 9},
	{id: "red-guard", name: "Red Guard", symbol: "🛡️", color: "#DC143C", maxLevel: 9},
	{id: "voidwarden", name: "Voidwarden", symbol: "🔮", color: "#4B0082", maxLevel: 9},
	{id: "demolitionist", name: "Demolitionist", symbol: "💥", color: "#FF8C00", maxLevel: 9},
];

export const SCENARIOS: Omit<Scenario, "id" | "completed" | "completedAt" | "notes">[] = [
	{
		number: 1,
		name: "Black Barrow",
		description: "Clear out the bandits from the Black Barrow",
		requirements: [],
		rewards: ["10 gold each", "1 checkmark each"],
	},
	{
		number: 2,
		name: "Barrow Lair",
		description: "Investigate the mysterious lair beneath the barrow",
		requirements: ["Scenario 1"],
		rewards: ["15 gold each", "1 checkmark each"],
	},
	{
		number: 3,
		name: "Inox Encampment",
		description: "Negotiate with the Inox tribe",
		requirements: ["Scenario 2"],
		rewards: ["20 gold each", "1 checkmark each"],
	},
	{
		number: 4,
		name: "Crypt of the Damned",
		description: "Explore the ancient crypt",
		requirements: ["Scenario 3"],
		rewards: ["25 gold each", "1 checkmark each"],
	},
	{
		number: 5,
		name: "Ruinous Rift",
		description: "Close the dimensional rift",
		requirements: ["Scenario 4"],
		rewards: ["30 gold each", "1 checkmark each"],
	},
	// Add more scenarios as needed
];

export const ITEMS: Item[] = [
	{
		id: "leather-armor",
		name: "Leather Armor",
		type: "body",
		cost: 20,
		description: "+1 Armor",
		equipped: false,
	},
	{
		id: "iron-helmet",
		name: "Iron Helmet",
		type: "head",
		cost: 15,
		description: "+1 Health",
		equipped: false,
	},
	{
		id: "boots-of-speed",
		name: "Boots of Speed",
		type: "legs",
		cost: 25,
		description: "+1 Movement",
		equipped: false,
	},
	{
		id: "healing-potion",
		name: "Healing Potion",
		type: "small-item",
		cost: 10,
		description: "Heal 3 damage",
		equipped: false,
	},
	// Add more items as needed
];
