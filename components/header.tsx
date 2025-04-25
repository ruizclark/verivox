import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/verivox-logo.png" alt="VERIVOX Logo" width={40} height={40} className="h-10 w-auto" />
            <span className="hidden font-serif text-xl font-bold text-harvard-crimson sm:inline-block">VERIVOX</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/profiles"
            className="font-serif text-sm font-medium transition-colors hover:text-harvard-crimson text-gray-700"
          >
            Profiles
          </Link>
          <Link
            href="/articles"
            className="font-serif text-sm font-medium transition-colors hover:text-harvard-crimson text-gray-700"
          >
            Articles
          </Link>
          <Link
            href="/about"
            className="font-serif text-sm font-medium transition-colors hover:text-harvard-crimson text-gray-700"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-harvard-crimson hover:bg-harvard-crimson/90">
              Register
            </Button>
          </Link>
          <Link href="/profile" className="md:hidden">
            <UserCircle className="h-6 w-6 text-gray-700" />
          </Link>
        </div>
      </div>
    </header>
  )
}
