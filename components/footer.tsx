import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Image src="/images/verivox-logo.png" alt="VERIVOX Logo" width={40} height={40} className="h-10 w-auto" />
              <span className="font-serif text-xl font-bold text-harvard-crimson">VERIVOX</span>
            </div>
            <p className="text-sm text-gray-600">Amplifying the Voices of the EdLD Community</p>
            <p className="text-sm text-gray-600 mt-2">
              VERIVOX was launched in 2025 as a space to amplify the voices of the EdLD community.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-lg font-medium text-gray-900">Platform</h3>
              <Link href="/profiles" className="text-sm text-gray-600 hover:text-harvard-crimson">
                Profiles
              </Link>
              <Link href="/articles" className="text-sm text-gray-600 hover:text-harvard-crimson">
                Articles
              </Link>
              <Link href="/about" className="text-sm text-gray-600 hover:text-harvard-crimson">
                About
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-lg font-medium text-gray-900">Account</h3>
              <Link href="/login" className="text-sm text-gray-600 hover:text-harvard-crimson">
                Log in
              </Link>
              <Link href="/register" className="text-sm text-gray-600 hover:text-harvard-crimson">
                Register
              </Link>
              <Link href="/profile" className="text-sm text-gray-600 hover:text-harvard-crimson">
                My Profile
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-lg font-medium text-gray-900">Legal</h3>
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-harvard-crimson">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-harvard-crimson">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-harvard-crimson">
                Contact
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} VERIVOX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
