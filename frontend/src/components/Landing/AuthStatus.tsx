import { Link } from "@tanstack/react-router"
import { LogIn, LogOut, UserRound } from "lucide-react"
import useAuth from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"

const quietLink = cn(
  "text-ink-soft hover:text-ink rounded-sm text-sm transition-colors duration-150",
  focusRing,
)

const solidButton = cn(
  "inline-flex h-10 items-center justify-center rounded-sm bg-signal px-4 text-sm font-semibold text-signal-ink",
  "transition-colors duration-150 hover:bg-signal/85",
  focusRing,
)

export function AuthStatus() {
  const { user, logout } = useAuth()

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/dashboard"
          className={cn(
            quietLink,
            "hidden items-center gap-1.5 px-2 sm:inline-flex",
          )}
          aria-label="Logged in. Open dashboard"
        >
          <UserRound className="size-4" aria-hidden="true" />
          <span>Logged in</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className={cn(quietLink, "inline-flex items-center gap-1.5 px-2")}
          data-testid="masthead-logout"
        >
          <LogOut className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Log out</span>
          <span className="sr-only sm:hidden">Log out</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/login" className={cn(quietLink, "px-2")}>
        <LogIn className="mr-1.5 inline size-4 sm:hidden" aria-hidden="true" />
        <span>Log in</span>
      </Link>
      <Link to="/signup" className={cn(solidButton, "px-3")}>
        Sign up
      </Link>
    </div>
  )
}
