import {promises as fs} from "fs";
import path from "path";

export const DATA_DIR = path.join(process.cwd(), "src", "data");
export const CAMPAIGNS_FILE = path.join(DATA_DIR, "campaigns.json");
export const CHARACTERS_FILE = path.join(DATA_DIR, "characters.json");

// Ensure data directory exists
export async function ensureDataDir(): Promise<void> {
	try {
		await fs.access(DATA_DIR);
	} catch {
		await fs.mkdir(DATA_DIR, {recursive: true});
	}
}

// Read campaigns from file
export async function readCampaigns(): Promise<any[]> {
	await ensureDataDir();
	try {
		const data = await fs.readFile(CAMPAIGNS_FILE, "utf-8");
		return JSON.parse(data);
	} catch {
		return [];
	}
}

// Write campaigns to file
export async function writeCampaigns(campaigns: any[]): Promise<void> {
	await ensureDataDir();
	await fs.writeFile(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
}

// Read characters from file
export async function readCharacters(): Promise<any[]> {
	await ensureDataDir();
	try {
		const data = await fs.readFile(CHARACTERS_FILE, "utf-8");
		return JSON.parse(data);
	} catch {
		return [];
	}
}

// Write characters to file
export async function writeCharacters(characters: any[]): Promise<void> {
	await ensureDataDir();
	await fs.writeFile(CHARACTERS_FILE, JSON.stringify(characters, null, 2));
}

// Create backup
export async function createBackup(type: string, data: any): Promise<void> {
	await ensureDataDir();
	const backupDir = path.join(DATA_DIR, "backup");
	try {
		await fs.access(backupDir);
	} catch {
		await fs.mkdir(backupDir, {recursive: true});
	}

	const timestamp = new Date().toISOString().split("T")[0];
	const filename = `${type}-${timestamp}.json`;
	const filepath = path.join(backupDir, filename);

	await fs.writeFile(filepath, JSON.stringify(data, null, 2));
}

// Create error response
export function createErrorResponse(message: string, status: number = 500): Response {
	return new Response(JSON.stringify({error: message}), {
		status,
		headers: {
			"Content-Type": "application/json",
		},
	});
}

// Create success response
export function createSuccessResponse(data: any, status: number = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
