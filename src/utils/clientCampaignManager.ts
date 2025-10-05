// Client-side campaign management using file-based API
export interface CampaignData {
	id: string;
	name: string;
	description: string;
	groupName: string;
	characters: CharacterData[];
	scenarios: ScenarioData[];
	prosperity: number;
	reputation: number;
	createdAt: Date;
	updatedAt: Date;
	notes: string;
}

export interface CharacterData {
	id: string;
	name: string;
	class: {
		id: string;
		name: string;
		symbol: string;
		color: string;
		maxLevel: number;
	};
	level: number;
	experience: number;
	gold: number;
	checkmarks: number;
	perks: string[];
	items: any[];
	notes: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ScenarioData {
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

export class ClientCampaignManager {
	static async getAllCampaigns(): Promise<CampaignData[]> {
		try {
			const response = await fetch("/api/campaigns");
			if (!response.ok) {
				throw new Error("Failed to fetch campaigns");
			}
			const campaigns = await response.json();

			// Convert date strings back to Date objects
			return campaigns.map((campaign: any) => ({
				...campaign,
				createdAt: new Date(campaign.createdAt),
				updatedAt: new Date(campaign.updatedAt),
				characters: campaign.characters.map((char: any) => ({
					...char,
					createdAt: new Date(char.createdAt),
					updatedAt: new Date(char.updatedAt),
				})),
				scenarios: campaign.scenarios.map((scenario: any) => ({
					...scenario,
					completedAt: scenario.completedAt ? new Date(scenario.completedAt) : undefined,
				})),
			}));
		} catch (error) {
			console.warn("Failed to load campaigns:", error);
			return [];
		}
	}

	static async createCampaign(campaignData: Omit<CampaignData, "id" | "createdAt" | "updatedAt" | "scenarios">): Promise<CampaignData> {
		try {
			const response = await fetch("/api/campaigns", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(campaignData),
			});

			if (!response.ok) {
				throw new Error("Failed to create campaign");
			}

			const newCampaign = await response.json();

			// Convert date strings back to Date objects
			return {
				...newCampaign,
				createdAt: new Date(newCampaign.createdAt),
				updatedAt: new Date(newCampaign.updatedAt),
				characters: newCampaign.characters.map((char: any) => ({
					...char,
					createdAt: new Date(char.createdAt),
					updatedAt: new Date(char.updatedAt),
				})),
			};
		} catch (error) {
			console.error("Failed to create campaign:", error);
			throw error;
		}
	}

	private static initializeScenarios(): ScenarioData[] {
		// Initialize with basic scenarios - in a real app, this would come from a data source
		const scenarioNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

		return scenarioNumbers.map((number) => ({
			id: crypto.randomUUID(),
			number,
			name: `Scenario ${number}`,
			description: `Description for scenario ${number}`,
			requirements: [],
			rewards: [],
			completed: false,
			notes: "",
		}));
	}

	static async getCampaign(id: string): Promise<CampaignData | undefined> {
		try {
			const response = await fetch(`/api/campaigns/${id}`);
			if (!response.ok) {
				if (response.status === 404) return undefined;
				throw new Error("Failed to fetch campaign");
			}
			const campaign = await response.json();

			// Convert date strings back to Date objects
			return {
				...campaign,
				createdAt: new Date(campaign.createdAt),
				updatedAt: new Date(campaign.updatedAt),
				characters: campaign.characters.map((char: any) => ({
					...char,
					createdAt: new Date(char.createdAt),
					updatedAt: new Date(char.updatedAt),
				})),
				scenarios: campaign.scenarios.map((scenario: any) => ({
					...scenario,
					completedAt: scenario.completedAt ? new Date(scenario.completedAt) : undefined,
				})),
			};
		} catch (error) {
			console.warn("Failed to load campaign:", error);
			return undefined;
		}
	}

	static async updateCampaign(id: string, updates: Partial<CampaignData>): Promise<CampaignData | undefined> {
		try {
			const response = await fetch(`/api/campaigns/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updates),
			});

			if (!response.ok) {
				if (response.status === 404) return undefined;
				throw new Error("Failed to update campaign");
			}

			const updatedCampaign = await response.json();

			// Convert date strings back to Date objects
			return {
				...updatedCampaign,
				createdAt: new Date(updatedCampaign.createdAt),
				updatedAt: new Date(updatedCampaign.updatedAt),
			};
		} catch (error) {
			console.error("Failed to update campaign:", error);
			return undefined;
		}
	}

	static async deleteCampaign(id: string): Promise<boolean> {
		try {
			const response = await fetch(`/api/campaigns/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				if (response.status === 404) return false;
				throw new Error("Failed to delete campaign");
			}

			return true;
		} catch (error) {
			console.error("Failed to delete campaign:", error);
			return false;
		}
	}

	static async exportData(type: "campaigns" | "characters" | "full" = "full"): Promise<void> {
		try {
			const response = await fetch(`/api/export?type=${type}`);
			if (!response.ok) {
				throw new Error("Failed to export data");
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;

			const timestamp = new Date().toISOString().split("T")[0];
			a.download = `gloomhaven-export-${type}-${timestamp}.json`;

			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Failed to export data:", error);
			throw error;
		}
	}
}
