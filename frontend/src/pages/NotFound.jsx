import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import ThemeToggle from "../components/ThemeToggle";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center">
          <FaExclamationTriangle className="text-[var(--chart-1)] text-6xl mb-4" />
        </div>
        <h1 className="text-6xl font-extrabold text-[var(--foreground)] mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">
          Page Not Found
        </h2>
        <p className="text-[var(--muted-foreground)] mb-8 text-lg">
          We couldn't find the page you're looking for. The page might have been
          removed, renamed, or is temporarily unavailable.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full sm:w-auto px-8 py-3 bg-[var(--purple-button)] text-[var(--purple-button-foreground)] rounded-md hover:bg-[var(--purple-button-hover)] transition-colors duration-200"
          >
            Go to Home Page
          </Link>
          <div className="mt-4">
            <Link
              to="/projects"
              className="text-[var(--chart-1)] hover:underline"
            >
              Go to Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
