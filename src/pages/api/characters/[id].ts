import type {APIRoute} from "astro";
import {readCharacters, writeCharacters, readCampaigns, writeCampaigns, createBackup, createErrorResponse, createSuccessResponse} from "../../../utils/fileOperations";

// Ensure this endpoint is server-rendered
export const prerender = false;

export const GET: APIRoute = async ({params}) => {
	try {
		const characterId = params.id;
		const characters = await readCharacters();

		const character = characters.find((c: any) => c.id === characterId);
		if (!character) {
			return createErrorResponse("Character not found", 404);
		}

		return createSuccessResponse(character);
	} catch (error) {
		return createErrorResponse("Failed to read character");
	}
};

export const PUT: APIRoute = async ({params, request}) => {
	try {
		const characterId = params.id;

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

		const characters = await readCharacters();
		const characterIndex = characters.findIndex((c: any) => c.id === characterId);

		if (characterIndex === -1) {
			return createErrorResponse("Character not found", 404);
		}

		// Create backup before changes
		await createBackup("characters", characters);

		// Update character
		characters[characterIndex] = {
			...characters[characterIndex],
			...updates,
			updatedAt: new Date().toISOString(),
		};

		await writeCharacters(characters);

		return createSuccessResponse(characters[characterIndex]);
	} catch (error) {
		console.error("Error updating character:", error);
		return createErrorResponse("Failed to update character");
	}
};

export const DELETE: APIRoute = async ({params}) => {
	try {
		const characterId = params.id;

		const characters = await readCharacters();
		const campaigns = await readCampaigns();

		const characterIndex = characters.findIndex((c: any) => c.id === characterId);

		if (characterIndex === -1) {
			return new Response(JSON.stringify({error: "Character not found"}), {
				status: 404,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}

		// Create backup before changes
		await createBackup("characters", characters);
		await createBackup("campaigns", campaigns);

		// Remove character
		characters.splice(characterIndex, 1);

		// Remove character from any campaigns that reference it
		const updatedCampaigns = campaigns.map((campaign: any) => ({
			...campaign,
			characters: campaign.characters.filter((charId: string) => charId !== characterId),
		}));

		await writeCharacters(characters);
		await writeCampaigns(updatedCampaigns);

		return createSuccessResponse({success: true});
	} catch (error) {
		console.error("Error deleting character:", error);
		return createErrorResponse("Failed to delete character");
	}
};
