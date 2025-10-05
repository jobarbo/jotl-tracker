import type {APIRoute} from "astro";
import {readCampaigns, writeCampaigns, readCharacters, writeCharacters, createBackup, createErrorResponse, createSuccessResponse} from "../../utils/fileOperations";

// Ensure this endpoint is server-rendered
export const prerender = false;

export const GET: APIRoute = async () => {
	try {
		const campaigns = await readCampaigns();
		const characters = await readCharacters();

		// Attach characters and scenarios to campaigns
		const campaignsWithCharacters = campaigns.map((campaign: any) => ({
			...campaign,
			characters: characters.filter((char: any) => char.campaignId === campaign.id),
			scenarios: campaign.scenarios || [], // Include scenarios if they exist
		}));

		return createSuccessResponse(campaignsWithCharacters);
	} catch (error) {
		return createErrorResponse("Failed to read campaigns");
	}
};

export const POST: APIRoute = async ({request}) => {
	try {
		// Check if request has body
		const contentType = request.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			return createErrorResponse("Content-Type must be application/json", 400);
		}

		const body = await request.text();
		if (!body || body.trim() === "") {
			return createErrorResponse("Request body is empty", 400);
		}

		const campaignData = JSON.parse(body);

		// Validate required fields
		if (!campaignData.name || !campaignData.groupName) {
			return createErrorResponse("Missing required fields", 400);
		}

		// Create new campaign
		const newCampaign = {
			id: crypto.randomUUID(),
			name: campaignData.name,
			description: campaignData.description || "",
			groupName: campaignData.groupName,
			prosperity: campaignData.prosperity || 1,
			reputation: campaignData.reputation || 0,
			notes: campaignData.notes || "",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// Create scenarios for the campaign (stored in campaign data)
		const scenarios = [];
		for (let i = 1; i <= 25; i++) {
			scenarios.push({
				id: crypto.randomUUID(),
				number: i,
				name: `Scenario ${i}`,
				description: `Description for scenario ${i}`,
				requirements: [],
				rewards: [],
				completed: false,
				notes: "",
			});
		}

		// Add scenarios to the campaign
		(newCampaign as any).scenarios = scenarios;

		// Read existing data
		const campaigns = await readCampaigns();
		const characters = await readCharacters();

		// Create backup before changes
		await createBackup("campaigns", campaigns);
		await createBackup("characters", characters);

		// Add new campaign
		campaigns.push(newCampaign);

		// Add characters if provided
		if (campaignData.characters && campaignData.characters.length > 0) {
			const newCharacters = campaignData.characters.map((char: any) => ({
				id: crypto.randomUUID(),
				campaignId: newCampaign.id,
				name: char.name,
				class: char.class,
				level: char.level || 1,
				experience: char.experience || 0,
				gold: char.gold || 30,
				checkmarks: char.checkmarks || 0,
				perks: char.perks || [],
				items: char.items || [],
				notes: char.notes || "",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}));

			characters.push(...newCharacters);
		}

		// Write data back to files
		await writeCampaigns(campaigns);
		await writeCharacters(characters);

		// Return the created campaign with characters and scenarios
		const createdCampaign = {
			...newCampaign,
			characters: characters.filter((char: any) => char.campaignId === newCampaign.id),
			scenarios: (newCampaign as any).scenarios,
		};

		return createSuccessResponse(createdCampaign, 201);
	} catch (error) {
		console.error("Error creating campaign:", error);
		return createErrorResponse("Failed to create campaign");
	}
};
