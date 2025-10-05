import type {APIRoute} from "astro";
import {readCampaigns, writeCampaigns, readCharacters, writeCharacters, createErrorResponse, createSuccessResponse} from "../../../utils/fileOperations";

// Ensure this endpoint is server-rendered
export const prerender = false;

export const GET: APIRoute = async ({params}) => {
	try {
		const campaignId = params.id;
		const campaigns = await readCampaigns();
		const characters = await readCharacters();

		const campaign = campaigns.find((c: any) => c.id === campaignId);
		if (!campaign) {
			return createErrorResponse("Campaign not found", 404);
		}

		// Attach characters and scenarios to campaign
		const campaignWithCharacters = {
			...campaign,
			characters: characters.filter((char: any) => char.campaignId === campaignId),
			scenarios: campaign.scenarios || [], // Include scenarios if they exist
		};

		return createSuccessResponse(campaignWithCharacters);
	} catch (error) {
		return createErrorResponse("Failed to read campaign");
	}
};

export const PUT: APIRoute = async ({params, request}) => {
	try {
		const campaignId = params.id;

		// Check if request has body
		const contentType = request.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			return createErrorResponse("Content-Type must be application/json", 400);
		}

		const body = await request.text();
		if (!body || body.trim() === "") {
			return createErrorResponse("Request body is empty", 400);
		}

		const updates = JSON.parse(body);

		const campaigns = await readCampaigns();
		const campaignIndex = campaigns.findIndex((c: any) => c.id === campaignId);

		if (campaignIndex === -1) {
			return createErrorResponse("Campaign not found", 404);
		}

		// Update campaign
		const campaign = campaigns[campaignIndex];

		// Handle completedScenarios if provided
		if (updates.completedScenarios && Array.isArray(updates.completedScenarios)) {
			// Update scenario completion status
			campaign.scenarios = campaign.scenarios.map((scenario: any) => {
				const isCompleted = updates.completedScenarios.includes(scenario.number);
				return {
					...scenario,
					completed: isCompleted,
					completedAt: isCompleted ? (scenario.completed ? scenario.completedAt : new Date().toISOString()) : undefined,
				};
			});

			// Remove completedScenarios from updates to avoid overwriting
			delete updates.completedScenarios;
		}

		// Apply other updates
		campaigns[campaignIndex] = {
			...campaign,
			...updates,
			updatedAt: new Date().toISOString(),
		};

		await writeCampaigns(campaigns);

		return createSuccessResponse(campaigns[campaignIndex]);
	} catch (error) {
		return createErrorResponse("Failed to update campaign");
	}
};

export const DELETE: APIRoute = async ({params}) => {
	try {
		const campaignId = params.id;

		const campaigns = await readCampaigns();
		const characters = await readCharacters();

		const campaignIndex = campaigns.findIndex((c: any) => c.id === campaignId);

		if (campaignIndex === -1) {
			return new Response(JSON.stringify({error: "Campaign not found"}), {
				status: 404,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}

		// Remove campaign
		campaigns.splice(campaignIndex, 1);

		// Remove associated characters
		const updatedCharacters = characters.filter((char: any) => char.campaignId !== campaignId);

		await writeCampaigns(campaigns);
		await writeCharacters(updatedCharacters);

		return createSuccessResponse({success: true});
	} catch (error) {
		return createErrorResponse("Failed to delete campaign");
	}
};
