import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BookOpen, Users, FileText } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Updated with clean design */}
      <section className="relative py-20 overflow-hidden bg-white">
        {/* Background Logo - Subtle watermark effect */}
        <div className="absolute right-0 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4 top-0 pointer-events-none">
          <Image
            src="/images/verivox-logo.png"
            alt=""
            width={800}
            height={800}
            className="w-[800px] h-auto"
            aria-hidden="true"
          />
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="font-serif text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900">
                  Amplifying the Voices of the EdLD Community
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  A platform for Harvard EdLD students and alumni to share their work and connect with each other.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-harvard-crimson hover:bg-harvard-crimson/90">
                    Join the Community
                  </Button>
                </Link>
                <Link href="/profiles">
                  <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    Explore Profiles
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-harvard-crimson/5 rounded-full"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-harvard-crimson/5 rounded-full"></div>

              {/* Logo with shadow effect */}
              <div className="relative bg-white rounded-xl shadow-xl p-8 h-full flex items-center justify-center">
                <Image
                  src="/images/verivox-logo.png"
                  alt="VERIVOX Logo"
                  width={400}
                  height={400}
                  className="w-full max-w-[300px] h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Updated with clean design */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                Connect with the EdLD Community
              </h2>
              <p className="text-gray-600 md:text-xl">
                VERIVOX provides a platform for EdLD students and alumni to showcase their work and connect with each
                other.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3 lg:gap-12">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Users className="h-12 w-12 text-harvard-crimson mb-4" />
                <h3 className="font-serif text-xl font-bold text-gray-900">Member Profiles</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Create your professional profile to showcase your work and connect with other EdLD members.
                </p>
                <Link href="/profiles" className="mt-4 inline-flex items-center text-harvard-crimson">
                  View Profiles <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <FileText className="h-12 w-12 text-harvard-crimson mb-4" />
                <h3 className="font-serif text-xl font-bold text-gray-900">Publish Articles</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Share your research, insights, and experiences with the EdLD community and beyond.
                </p>
                <Link href="/articles" className="mt-4 inline-flex items-center text-harvard-crimson">
                  Read Articles <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <BookOpen className="h-12 w-12 text-harvard-crimson mb-4" />
                <h3 className="font-serif text-xl font-bold text-gray-900">EdLD Community</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Connect with current students and alumni from the Doctor of Education Leadership program.
                </p>
                <Link href="/about" className="mt-4 inline-flex items-center text-harvard-crimson">
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Profiles Section - Updated with clean design */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                Featured Profiles
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl">Meet some of our EdLD community members</p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
            {[1, 2, 3].map((i) => (
              <Link href={`/profiles/profile-${i}`} key={i}>
                <Card className="overflow-hidden transition-all hover:shadow-lg border border-gray-200">
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=300&width=300&text=Profile+${i}`}
                      alt={`Profile ${i}`}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-serif text-lg font-bold text-gray-900">EdLD Member {i}</h3>
                    <p className="text-sm text-gray-500">Class of 202{i + 3}</p>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                      Education leader with a passion for equity and innovation in K-12 education.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/profiles">
              <Button variant="outline" className="gap-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                View All Profiles <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles Section - Updated with clean design */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                Latest Articles
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl">Insights and research from the EdLD community</p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
            {[1, 2, 3, 4].map((i) => (
              <Link href={`/articles/article-${i}`} key={i}>
                <Card className="overflow-hidden transition-all hover:shadow-lg border border-gray-200">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=200&width=400&text=Article+${i}`}
                      alt={`Article ${i}`}
                      width={400}
                      height={200}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-serif text-lg font-bold text-gray-900">
                      Transforming Education Through Leadership and Innovation
                    </h3>
                    <p className="text-sm text-gray-500">
                      By EdLD Member {i} • June {i + 10}, 2025
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                      An exploration of how educational leadership can drive meaningful change in our schools and
                      communities.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/articles">
              <Button variant="outline" className="gap-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                View All Articles <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Updated with clean design */}
      <section className="bg-harvard-crimson py-16 md:py-24">
        <div className="container px-4 md:px-6 text-white">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-3 max-w-3xl">
              <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Join the VERIVOX Community
              </h2>
              <p className="md:text-xl">
                Connect with fellow EdLD students and alumni, share your work, and amplify your voice.
              </p>
            </div>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-harvard-crimson"
              >
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
