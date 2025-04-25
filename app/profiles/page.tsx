import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function ProfilesPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            EdLD Community Profiles
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Connect with current students and alumni from the Doctor of Education Leadership program.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="my-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search profiles..." className="w-full pl-8" />
        </div>
        <div className="flex gap-2">
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="">All Cohorts</option>
            <option value="2025">Class of 2025</option>
            <option value="2024">Class of 2024</option>
            <option value="2023">Class of 2023</option>
          </select>
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="">All Interests</option>
            <option value="k12">K-12 Education</option>
            <option value="higher-ed">Higher Education</option>
            <option value="policy">Education Policy</option>
          </select>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Link href={`/profiles/profile-${i + 1}`} key={i}>
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-square overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=300&width=300&text=Profile+${i + 1}`}
                  alt={`Profile ${i + 1}`}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-serif text-lg font-bold">EdLD Member {i + 1}</h3>
                <p className="text-sm text-muted-foreground">Class of {2020 + (i % 6)}</p>
                <p className="mt-2 line-clamp-3 text-sm">
                  {i % 3 === 0
                    ? "Education leader with a passion for equity and innovation in K-12 education."
                    : i % 3 === 1
                      ? "Researcher focused on higher education policy and institutional transformation."
                      : "Advocate for educational equity and community engagement in urban schools."}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-harvard-crimson text-white hover:bg-harvard-crimson/90">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
