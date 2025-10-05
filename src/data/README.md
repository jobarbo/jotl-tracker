# Gloomhaven Tracker Data Directory

This directory contains the static JSON files that serve as the database for the Gloomhaven Tracker application.

## File Structure

```
src/data/
├── campaigns.json          # Main campaigns data
├── characters.json         # Characters across all campaigns
├── scenarios.json          # Scenario definitions and progress
├── items.json             # Item database
├── backup/                # Automatic backups
│   ├── campaigns-YYYY-MM-DD.json
│   └── characters-YYYY-MM-DD.json
└── exports/               # Manual exports
    ├── campaigns-export-YYYY-MM-DD.json
    └── full-export-YYYY-MM-DD.json
```

## Data Format

### Campaigns (`campaigns.json`)

```json
[
	{
		"id": "uuid",
		"name": "Campaign Name",
		"description": "Campaign description",
		"groupName": "Group Name",
		"prosperity": 1,
		"reputation": 0,
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z",
		"notes": "Campaign notes"
	}
]
```

### Characters (`characters.json`)

```json
[
	{
		"id": "uuid",
		"campaignId": "campaign-uuid",
		"name": "Character Name",
		"class": {
			"id": "hatchet",
			"name": "Hatchet",
			"symbol": "🎯",
			"color": "#8B4513",
			"maxLevel": 9
		},
		"level": 1,
		"experience": 0,
		"gold": 30,
		"checkmarks": 0,
		"perks": [],
		"items": [],
		"notes": "",
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
]
```

## Backup Strategy

- **Automatic Backups**: Created daily via API endpoints
- **Manual Exports**: Available through the UI
- **Version Control**: All JSON files can be committed to git
- **Data Integrity**: JSON validation on read/write operations

## Benefits

1. **Persistent**: Data survives browser restarts and clears
2. **Portable**: Easy to backup, restore, and share
3. **Version Control**: Can track changes with git
4. **Human Readable**: JSON is easy to read and edit manually
5. **No Database**: No server setup required
6. **Cross-Device**: Can sync via cloud storage or git

## Usage

The application will automatically:

- Read from JSON files on startup
- Write changes back to JSON files
- Create backups before major changes
- Validate data integrity

## Manual Editing

You can manually edit the JSON files, but be careful to:

- Maintain valid JSON syntax
- Use proper UUIDs for IDs
- Keep date formats consistent
- Validate changes in the application afterward
