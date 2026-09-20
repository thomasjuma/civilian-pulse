import { Link } from "@tanstack/react-router"

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-rule border-t">
      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="text-ink font-semibold text-sm">Navigation</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <a
                  href="#dispatches"
                  className="text-ink-soft hover:text-ink transition-colors duration-150"
                >
                  Latest dispatches
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-ink-soft hover:text-ink transition-colors duration-150"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#listen"
                  className="text-ink-soft hover:text-ink transition-colors duration-150"
                >
                  Listen and watch
                </a>
              </li>
              <li>
                <a
                  href="#brief"
                  className="text-ink-soft hover:text-ink transition-colors duration-150"
                >
                  The Brief
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-ink font-semibold text-sm">For readers</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/login"
                  className="text-ink-soft hover:text-ink transition-colors duration-150"
                >
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-ink-soft hover:text-ink transition-colors duration-150"
                >
                  File a dispatch
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@civilianpulse.local"
                  className="text-ink-soft hover:text-ink transition-colors duration-150"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-ink font-semibold text-sm">Community</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  className="text-ink-soft hover:text-ink text-left transition-colors duration-150"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-ink-soft hover:text-ink text-left transition-colors duration-150"
                >
                  GitHub
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-ink font-semibold text-sm">Legal</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  className="text-ink-soft hover:text-ink text-left transition-colors duration-150"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-ink-soft hover:text-ink text-left transition-colors duration-150"
                >
                  Terms
                </button>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-ink-muted mt-10 border-t border-rule pt-8 text-sm">
          Civilian Pulse © {currentYear}. A public record of our city.
        </p>
      </div>
    </footer>
  )
}
