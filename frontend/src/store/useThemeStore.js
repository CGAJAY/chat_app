import { create } from "zustand";

// Zustand store for managing the theme state
export const useThemeStore = create((set) => ({
	// Check if the theme is stored in localStorage, otherwise use the default
	theme: localStorage.getItem("chat-theme") || "cupcake",
	// Function to set the theme
	setTheme: (theme) => {
		// save the selected theme to localStorage
		localStorage.setItem("chat-theme", theme);
		// Update the theme in the store
		set({ theme });
	},
}));
