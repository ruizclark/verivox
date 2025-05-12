// This file is part of the "ui" component library.
import Link from "next/link"
import Image from "next/image"

// Export the Footer component
export function Footer() {
  // This component renders the footer of the website
  return (
    // See a footer element for semantic HTML
    <footer className="border-t bg-gray-50">
      <div className="container py-8 md:py-12">
        {/* Use 3 columns on md+ */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left column: logo & description */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {/* Use Image component for the logo */}
              <Image
                src="/images/verivox-logo.png"
                alt="VERIVOX Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              {/* Use a span for the logo text */}
              <span className="font-serif text-xl font-bold text-harvard-crimson">
                VERIVOX
              </span>
            </div>
            {/* Use a paragraph for the description */}
            <p className="text-sm text-gray-600">
              Amplifying the Voices of the EdLD Community
            </p>
            {/* Use a paragraph for the additional description */}
            <p className="text-sm text-gray-600 mt-2">
              VERIVOX was launched in 2025 as a space to amplify the voices of the
              EdLD community.
            </p>
          </div>

          {/* Center column: Platform */}
          <div className="flex flex-col gap-2 items-center"> 
          {/* Center this column’s contents */}
          <h3 className="font-serif text-lg font-medium text-gray-900">
              Platform
            </h3>
            <Link
              href="/profiles"
              className="text-sm text-gray-600 hover:text-harvard-crimson"
            >
              {}
              {/* Use a span for the link text */}
              Profiles
            </Link>
            <Link
              href="/articles"
              className="text-sm text-gray-600 hover:text-harvard-crimson"
            >
              Articles
            </Link>
            <Link
              href="/about"
              className="text-sm text-gray-600 hover:text-harvard-crimson"
            >
              About
            </Link>
          </div>

          {/* Right column: Legal */}
          <div className="flex flex-col gap-2 items-center"> 
            <h3 className="font-serif text-lg font-medium text-gray-900">
              Legal
            </h3>
            <Link
              href="/privacy"
              className="text-sm text-gray-600 hover:text-harvard-crimson"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-600 hover:text-harvard-crimson"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-600 hover:text-harvard-crimson"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} VERIVOX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
