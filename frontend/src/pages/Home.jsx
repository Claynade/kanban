import React from "react";
import { Link } from "react-router-dom";
import { FaTasks, FaChartLine, FaUsers, FaRegLightbulb } from "react-icons/fa";
import { AiOutlineArrowRight } from "react-icons/ai";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--secondary)] text-[var(--foreground)] relative">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Simplify Your Workflow with{" "}
            <span className="text-[var(--chart-1)]">Kanban</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[var(--muted-foreground)] max-w-3xl mx-auto mb-8">
            Boost team productivity with our intuitive task management platform.
            Visualize work, maximize efficiency, and deliver results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 rounded-md bg-[var(--purple-button)] text-[var(--purple-button-foreground)] text-lg font-medium hover:bg-[var(--purple-button-hover)] transition-colors duration-200"
            >
              Login to Your Projects
            </Link>
            <Link
              to="/signup"
              className="px-8 py-3 rounded-md bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)] text-lg font-medium hover:bg-[var(--muted)] transition-colors duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        {/* Preview Image */}
        <div className="mt-16 rounded-xl overflow-hidden shadow-xl border border-[var(--border)]">
          <img
            src="/bg.jpg"
            alt="Kanban Projects Preview"
            className="w-full h-auto rounded-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-[var(--card)] p-6 rounded-lg shadow-md border border-[var(--border)] hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[var(--chart-1)]/20 rounded-full flex items-center justify-center mb-4">
              <FaTasks className="text-[var(--chart-1)] text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Visual Task Management
            </h3>
            <p className="text-[var(--muted-foreground)]">
              Organize tasks into customizable lists with drag-and-drop
              simplicity.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[var(--card)] p-6 rounded-lg shadow-md border border-[var(--border)] hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[var(--chart-2)]/20 rounded-full flex items-center justify-center mb-4">
              <FaUsers className="text-[var(--chart-2)] text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-[var(--muted-foreground)]">
              Work together seamlessly with real-time updates and shared project
              spaces.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[var(--card)] p-6 rounded-lg shadow-md border border-[var(--border)] hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[var(--chart-3)]/20 rounded-full flex items-center justify-center mb-4">
              <FaChartLine className="text-[var(--chart-3)] text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-[var(--muted-foreground)]">
              Monitor project advancement with intuitive visual indicators and
              status updates.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-[var(--card)] p-6 rounded-lg shadow-md border border-[var(--border)] hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[var(--chart-4)]/20 rounded-full flex items-center justify-center mb-4">
              <FaRegLightbulb className="text-[var(--chart-4)] text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Customizable Workflow
            </h3>
            <p className="text-[var(--muted-foreground)]">
              Adapt the platform to your unique process with flexible board
              configurations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[var(--chart-1)]/10 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to streamline your workflow?
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] mb-8">
              Join thousands of teams already using Kanban to organize their
              projects and boost productivity.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 rounded-md bg-[var(--purple-button)] text-[var(--purple-button-foreground)] text-lg font-medium hover:bg-[var(--purple-button-hover)] transition-colors duration-200"
            >
              Get Started Today <AiOutlineArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--card)] border-t border-[var(--border)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-[Shantell_sans] text-[var(--foreground)] text-2xl font-bold">
                <img src="/icon.svg" className="h-8" alt="Logo" />
                kanban
              </div>
              <p className="mt-4 text-[var(--muted-foreground)]">
                Simplifying project management for teams of all sizes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="#"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="#"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    API
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="#"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[var(--muted-foreground)] text-sm">
              © {new Date().getFullYear()} Kanban. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="#"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                Terms
              </Link>
              <Link
                to="#"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                Privacy
              </Link>
              <Link
                to="#"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
