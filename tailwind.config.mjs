/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				// Custom colors for Gloomhaven theme
				"gloom-purple": "#6B46C1",
				"gloom-blue": "#2563EB",
				"gloom-dark": "#1F2937",
				"gloom-darker": "#111827",
			},
			fontFamily: {
				gloom: ["Inter", "system-ui", "sans-serif"],
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
