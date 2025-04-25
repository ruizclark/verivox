import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Globe, FileText, MapPin, Calendar, Mail } from "lucide-react"

export default function ProfilePage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the profile data based on the ID
  const profile = {
    id: params.id,
    name: "Dr. Jane Smith",
    cohort: "Class of 2023",
    title: "Education Policy Researcher",
    organization: "Harvard Graduate School of Education",
    location: "Cambridge, MA",
    email: "jane.smith@example.com",
    bio: "Dr. Jane Smith is an education policy researcher with over 10 years of experience in K-12 education. Her research focuses on educational equity, school leadership, and policy implementation. She is passionate about creating more equitable educational opportunities for all students.",
    linkedin: "https://linkedin.com/in/janesmith",
    website: "https://janesmith.com",
    interests: ["Educational Equity", "School Leadership", "Policy Implementation", "K-12 Education"],
    education: [
      {
        degree: "Ed.L.D.",
        institution: "Harvard Graduate School of Education",
        year: "2023",
      },
      {
        degree: "M.Ed.",
        institution: "Teachers College, Columbia University",
        year: "2015",
      },
      {
        degree: "B.A. in Education",
        institution: "University of Michigan",
        year: "2010",
      },
    ],
    experience: [
      {
        title: "Education Policy Researcher",
        organization: "Harvard Graduate School of Education",
        period: "2023 - Present",
        description: "Conducting research on educational equity and policy implementation.",
      },
      {
        title: "School Principal",
        organization: "Boston Public Schools",
        period: "2018 - 2020",
        description: "Led a K-8 school with 500 students and 50 staff members.",
      },
      {
        title: "Teacher",
        organization: "New York City Department of Education",
        period: "2010 - 2018",
        description: "Taught middle school mathematics and served as department chair.",
      },
    ],
    publications: [
      {
        title: "Transforming School Leadership: A Framework for Equity and Excellence",
        journal: "Journal of Educational Leadership",
        year: "2024",
      },
      {
        title: "Policy Implementation in Urban Schools: Challenges and Opportunities",
        journal: "Education Policy Review",
        year: "2023",
      },
    ],
  }

  return (
    <div className="container py-10">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-12">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative h-60 w-60 overflow-hidden rounded-full border-4 border-harvard-crimson">
              <Image
                src={`/placeholder.svg?height=240&width=240&text=${profile.name}`}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
            <h1 className="mt-4 font-serif text-2xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.cohort}</p>
            <p className="text-center font-medium">{profile.title}</p>
            <p className="text-center text-sm text-muted-foreground">{profile.organization}</p>
          </div>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.cohort}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.linkedin && (
                  <Link href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </Button>
                  </Link>
                )}
                {profile.website && (
                  <Link href={profile.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Globe className="h-4 w-4" /> Website
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-serif text-lg font-medium mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-harvard-crimson text-white"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-serif text-2xl font-bold mb-4">About</h2>
              <p className="text-muted-foreground">{profile.bio}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-serif text-2xl font-bold mb-4">Education</h2>
              <div className="space-y-4">
                {profile.education.map((edu, i) => (
                  <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                    <h3 className="font-medium">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground">{edu.year}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-serif text-2xl font-bold mb-4">Experience</h2>
              <div className="space-y-4">
                {profile.experience.map((exp, i) => (
                  <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                    <h3 className="font-medium">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">{exp.organization}</p>
                    <p className="text-sm text-muted-foreground">{exp.period}</p>
                    <p className="mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-serif text-2xl font-bold mb-4">Publications</h2>
              <div className="space-y-4">
                {profile.publications.map((pub, i) => (
                  <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <FileText className="h-5 w-5 text-harvard-crimson mt-1" />
                    <div>
                      <h3 className="font-medium">{pub.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pub.journal}, {pub.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Link href="/profiles">
              <Button variant="outline">Back to Profiles</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
