import type {APIRoute} from "astro";
import {readCampaigns, readCharacters, createErrorResponse, createSuccessResponse} from "../../utils/fileOperations";

// Ensure this endpoint is server-rendered
export const prerender = false;

export const GET: APIRoute = async ({url}) => {
	try {
		const type = url.searchParams.get("type") || "full";

		const campaigns = await readCampaigns();
		const characters = await readCharacters();

		let exportData: any = {};

		switch (type) {
			case "campaigns":
				exportData = {
					campaigns,
					exportDate: new Date().toISOString(),
					version: "1.0",
				};
				break;
			case "characters":
				exportData = {
					characters,
					exportDate: new Date().toISOString(),
					version: "1.0",
				};
				break;
			case "full":
			default:
				exportData = {
					campaigns,
					characters,
					exportDate: new Date().toISOString(),
					version: "1.0",
					description: "Complete Gloomhaven Tracker export",
				};
				break;
		}

		const timestamp = new Date().toISOString().split("T")[0];
		const filename = `gloomhaven-export-${type}-${timestamp}.json`;

		return new Response(JSON.stringify(exportData, null, 2), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Content-Disposition": `attachment; filename="${filename}"`,
			},
		});
	} catch (error) {
		return createErrorResponse("Failed to export data");
	}
};
