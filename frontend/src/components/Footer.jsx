import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[var(--card)] border-t border-[var(--border)] py-8 px-4 sm:px-6 lg:px-8">
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

        <div className="border-t border-[var(--border)] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
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
  );
};

export default Footer;
