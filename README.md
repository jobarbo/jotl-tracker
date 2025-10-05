# Gloomhaven: Jaws of the Lion Campaign Tracker

A modern web application built with Astro for tracking multiple Gloomhaven: Jaws of the Lion campaigns across different groups.

## Features

- **Multi-Campaign Support**: Track multiple campaigns simultaneously
- **Character Management**: Create and manage characters with progression tracking
- **Scenario Tracking**: Track scenario completion across all campaigns
- **Group Organization**: Organize campaigns by different play groups
- **Modern UI**: Dark theme with responsive design
- **Local Storage**: Data persists in your browser

## Getting Started

### Prerequisites

- Node.js 18.20.8 or higher
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:4321`

## Usage

### Creating a Campaign

1. Click "Start New Campaign" on the dashboard
2. Fill in campaign details:
   - Campaign name
   - Group name
   - Optional description
3. Add initial characters (you can add more later)
4. Set starting prosperity and reputation
5. Click "Create Campaign"

### Managing Characters

- View all characters across campaigns on the Characters page
- Track character progression: level, experience, gold, checkmarks
- Manage character perks and items
- Add notes for each character

### Tracking Scenarios

- View scenario progress on the Scenarios page
- See completion status across all campaigns
- Mark scenarios as complete with notes
- Track overall progress and success rates

### Campaign Management

- View detailed campaign information
- Edit campaign settings
- Add or remove characters
- Track campaign-specific notes

## Character Classes

The tracker includes all four Jaws of the Lion character classes:

- **Hatchet** 🎯 - Ranged damage dealer
- **Red Guard** 🛡️ - Tank and protector
- **Voidwarden** 🔮 - Support and control
- **Demolitionist** 💥 - Area damage specialist

## Data Storage

Currently, all data is stored in your browser's localStorage. This means:

- Data persists between sessions
- Data is private to your browser
- Clearing browser data will remove all campaigns

For production use, consider implementing a backend API with a database.

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Customization

### Adding New Scenarios

Edit `src/types/index.ts` to add more scenarios to the `SCENARIOS` array.

### Modifying Character Classes

Update the `CHARACTER_CLASSES` array in `src/types/index.ts` to modify character class information.

### Styling

The application uses Tailwind CSS for styling. Modify the classes in the Astro components to change the appearance.

## Contributing

This is a personal project, but feel free to fork and modify for your own use!

## License

This project is for personal use. Gloomhaven is a trademark of Cephalofair Games.
