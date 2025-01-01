// React hook for managing local component state
import { useState } from "react";
// Zustand store for authentication state management
import { useAuthStore } from "../store/useAuthStore";
import {
	User,
	Mail,
	Lock,
	Eye,
	EyeOff,
	Loader2,
	MessageSquare,
} from "lucide-react"; // Icons from the lucide-react library
// Custom component for the right-side image/pattern
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom"; // For navigation
import toast from "react-hot-toast"; // Toast notifications

const SignUpPage = () => {
	// State for showing/hiding password input
	const [showPassword, setShowPassword] = useState(false);

	// State for form data (name, email, password)
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
	});

	// Zustand store methods and state
	const { signup, isSigningUp } = useAuthStore();

	// Function to validate the form data before submission
	const validateForm = () => {
		// Check if any of the fields are empty
		if (
			!formData.fullName ||
			!formData.email ||
			!formData.password
		) {
			return toast.error("All fields are required");
		}
		// Check if the "fullName" field is empty (after removing extra spaces)
		if (!formData.fullName.trim()) {
			return toast.error("Full Name is required");
		}

		// Check if the "email" field is empty (after removing extra spaces)
		if (!formData.email.trim()) {
			return toast.error("Email is required");
		}

		// Regular expression to validate the email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		// Test if the "email" field has a valid email format
		if (!emailRegex.test(formData.email)) {
			return toast.error("Invalid email address");
		}

		// Check if the "password" field is empty (after removing extra spaces)
		if (!formData.password.trim()) {
			return toast.error("Password is required");
		}
		// Regular expression to validate password
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

		// Check if the password meets the requirements
		if (!passwordRegex.test(formData.password)) {
			return toast.error(
				"Password must contain at least one uppercase letter, one lowercase letter, and one number"
			);
		}

		// Check if the "password" is less than 6 characters long
		if (formData.password.length < 6) {
			return toast.error(
				"Password must be at least 6 characters long"
			);
		}

		// If all validations pass, return true
		return true;
	};

	// Form submission handler
	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = validateForm();

		if (success === true) {
			// Call signup function from Zustand store
			await signup(formData);
		}
	};

	return (
		<div className="min-h-screen grid lg:grid-cols-2">
			{/* Left side: Form section */}
			<div className="flex flex-col justify-center items-center p-6 sm:p-12">
				<div className="w-full max-w-md space-y-8">
					{/* Logo and Title */}
					<div className="text-center mb-8">
						<div className="flex flex-col items-center gap-2 group">
							<div
								className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                group-hover:bg-primary/20 transition-colors"
							>
								<MessageSquare className="size-6 text-primary" />
							</div>
							<h1 className="text-2xl font-bold mt-2">
								Create Account
							</h1>
							<p className="text-base-content/60">
								Get started with your free account
							</p>
						</div>
					</div>

					{/* Sign-Up Form */}
					<form
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						{/* Full Name Field */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">
									Full Name
								</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="size-5 text-base-content/40" />
								</div>
								<input
									type="text"
									className="input input-bordered w-full pl-10"
									placeholder="John Doe"
									value={formData.fullName}
									onChange={(e) =>
										setFormData({
											...formData,
											fullName: e.target.value,
										})
									}
								/>
							</div>
						</div>

						{/* Email Field */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">
									Email
								</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="size-5 text-base-content/40" />
								</div>
								<input
									type="email"
									className="input input-bordered w-full pl-10"
									placeholder="you@example.com"
									value={formData.email}
									onChange={(e) =>
										setFormData({
											...formData,
											email: e.target.value,
										})
									}
								/>
							</div>
						</div>

						{/* Password Field */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">
									Password
								</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="size-5 text-base-content/40" />
								</div>
								<input
									type={showPassword ? "text" : "password"}
									className="input input-bordered w-full pl-10"
									placeholder="••••••••"
									value={formData.password}
									onChange={(e) =>
										setFormData({
											...formData,
											password: e.target.value,
										})
									}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() =>
										setShowPassword(!showPassword)
									}
								>
									{showPassword ? (
										<EyeOff className="size-5 text-base-content/40" />
									) : (
										<Eye className="size-5 text-base-content/40" />
									)}
								</button>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="btn btn-primary w-full"
							disabled={isSigningUp}
						>
							{isSigningUp ? (
								<>
									<Loader2 className="size-5 animate-spin" />
									Loading...
								</>
							) : (
								"Create Account"
							)}
						</button>
					</form>

					{/* Redirect to Login */}
					<div className="text-center">
						<p className="text-base-content/60">
							Already have an account?{" "}
							<Link
								to="/login"
								className="link link-primary"
							>
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
			{/* Right side: Image/Pattern section */}
			<AuthImagePattern
				title="Join our community"
				subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
			/>
		</div>
	);
};

export default SignUpPage;
