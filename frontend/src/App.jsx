import Navbar from "./components/Navbar"; // The navigation bar for the app
import HomePage from "./pages/HomePage"; // Home page component
import SignUpPage from "./pages/SignUpPage"; // Sign-up page component
import LoginPage from "./pages/LoginPage"; // Login page component
import ProfilePage from "./pages/ProfilePage"; // Profile page component
import SettingsPage from "./pages/SettingsPage"; // Settings page component

// React Router components for routing
import { Routes, Route, Navigate } from "react-router-dom";
// Zustand store for authentication state
import { useAuthStore } from "./store/useAuthStore";
// React hook for handling side effects
import { useEffect } from "react";
// A spinner/loader component for loading states
import { Loader } from "lucide-react";

// Toast notifications
import { Toaster } from "react-hot-toast";

const App = () => {
	const { user, checkAuth, isCheckingAuth } =
		useAuthStore();

	// Check authentication status when the app mounts
	useEffect(() => {
		checkAuth(); // Call the `checkAuth` function to verify user authentication
	}, [checkAuth]); //`checkAuth` is only called when it changes

	// Show a loader while checking authentication and no user is available
	if (isCheckingAuth && !user)
		return (
			<div className="flex items-center justify-center h-screen">
				{/* Centered spinner for the loading state */}
				<Loader className="size-10 animate-spin" />
			</div>
		);

	// Main application return block
	return (
		<div>
			{/* Navbar visible on all routes */}
			<Navbar />

			{/* Define application routes */}
			<Routes>
				{/* Home Page: Accessible only to authenticated users */}
				<Route
					path="/"
					element={
						user ? <HomePage /> : <Navigate to="/login" /> // Redirect to login if user is not authenticated
					}
				/>

				{/* Sign-Up Page: Accessible only to unauthenticated users */}
				<Route
					path="/signup"
					element={
						!user ? <SignUpPage /> : <Navigate to="/" />
					}
				/>

				{/* Login Page: Accessible only to unauthenticated users */}
				<Route
					path="/login"
					element={
						!user ? <LoginPage /> : <Navigate to="/" /> // Redirect to home if user is authenticated
					}
				/>

				{/* Profile Page: Accessible only to authenticated users */}
				<Route
					path="/profile"
					element={
						user ? (
							<ProfilePage />
						) : (
							<Navigate to="/login" /> // Redirect to login if user is not authenticated
						)
					}
				/>

				{/* Settings Page: Accessible to all users */}
				<Route
					path="/settings"
					element={<SettingsPage />} // Settings page is not restricted
				/>
			</Routes>
			<Toaster />
		</div>
	);
};

export default App;
