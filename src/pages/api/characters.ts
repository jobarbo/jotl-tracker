import type {APIRoute} from "astro";
import {readCharacters, writeCharacters, createBackup, createErrorResponse, createSuccessResponse} from "../../utils/fileOperations";

// Ensure this endpoint is server-rendered
export const prerender = false;

export const GET: APIRoute = async () => {
	try {
		const characters = await readCharacters();

		return createSuccessResponse(characters);
	} catch (error) {
		return createErrorResponse("Failed to read characters");
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

		const characterData = JSON.parse(body);

		// Validate required fields
		if (!characterData.name || !characterData.class) {
			return createErrorResponse("Missing required fields", 400);
		}

		// Create new character
		const newCharacter = {
			id: crypto.randomUUID(),
			name: characterData.name,
			class: characterData.class,
			level: characterData.level || 1,
			experience: characterData.experience || 0,
			gold: characterData.gold || 30, // Starting gold
			checkmarks: characterData.checkmarks || 0,
			perks: characterData.perks || [],
			items: characterData.items || [],
			equipment: characterData.equipment || {},
			abilities: characterData.abilities || "",
			notes: characterData.notes || "",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// Read existing data
		const characters = await readCharacters();

		// Create backup before changes
		await createBackup("characters", characters);

		// Add new character
		characters.push(newCharacter);

		// Write data back to file
		await writeCharacters(characters);

		return createSuccessResponse(newCharacter, 201);
	} catch (error) {
		console.error("Error creating character:", error);
		return createErrorResponse("Failed to create character");
	}
};
