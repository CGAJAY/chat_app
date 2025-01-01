// For navigation between pages
import { Link } from "react-router-dom";
// Access authentication state
import { useAuthStore } from "../store/useAuthStore";
// Icon library for consistent UI
import {
	LogOut,
	MessageSquare,
	Settings,
	User,
} from "lucide-react";

const Navbar = () => {
	const { logout, user } = useAuthStore();

	return (
		// Main header container with fixed positioning and styling
		<header
			className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
		>
			{/* Inner container for aligning content */}
			<div className="container mx-auto px-4 h-16">
				<div className="flex items-center justify-between h-full">
					{/* Left side of the Navbar */}
					<div className="flex items-center gap-8">
						{/* Logo linking to the home page */}
						<Link
							to="/"
							className="flex items-center gap-2.5 hover:opacity-80 transition-all"
						>
							{/* Logo icon */}
							<div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
								<MessageSquare className="w-5 h-5 text-primary" />
							</div>
							{/* Brand name */}
							<h1 className="text-lg font-bold">Chatty</h1>
						</Link>
					</div>

					{/* Right side of the Navbar */}
					<div className="flex items-center gap-2">
						{/* Settings button */}
						<Link
							to={"/settings"}
							className={`
              btn btn-sm gap-2 transition-colors
              
              `}
						>
							<Settings className="w-4 h-4" />
							<span className="hidden sm:inline">
								Settings
							</span>
						</Link>

						{/* User actions (profile and logout) */}
						{user && (
							<>
								{/* Profile button */}
								<Link
									to={"/profile"}
									className={`btn btn-sm gap-2`}
								>
									<User className="size-5" />
									<span className="hidden sm:inline">
										Profile
									</span>
								</Link>

								{/* Logout button */}
								<button
									className="flex gap-2 items-center"
									onClick={logout}
								>
									<LogOut className="size-5" />
									<span className="hidden sm:inline">
										Logout
									</span>
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
