// app/about/page.tsx

import Image from "next/image"
import { Button } from "@/components/ui/button"
// ✅ EDIT: import the client component that chooses /signup vs /register
import RegisterCTA from "@/components/RegisterCTA"

export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Overview Section */}
        <section>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Image
              src="/images/verivox-logo.png"
              alt="VERIVOX Logo"
              width={120}
              height={120}
              className="h-32 w-auto"
            />
            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About VERIVOX
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Amplifying the Voices of the EdLD Community
              </p>
            </div>
          </div>

          <p>
            VERIVOX was launched in 2025 as a space to amplify the voices of current and former candidates of the
            Doctoral program in Education Leadership (EdLD) at the Harvard Graduate School of Education (HGSE). 
            VERIVOX is a student-led initiative, operating independently of HGSE. As a volunteer-run platform, VERIVOX 
            does not receive financial support, sponsorship, or official endorsement from Harvard University. 
            The views expressed on the platform are solely those of our members, and do not necessarily reflect 
            the opinions of VERIVOX’s founders or of HGSE.
          </p>
        </section>

        {/* Mission Section */}
        <section>
          <h2 className="font-serif text-2xl font-bold mb-4">Our Mission</h2>
          <p className="mb-6">
            Our mission is to create a platform where EdLD students and alumni can share their insights and
            experiences with each other and the broader education community. We believe that by amplifying these voices,
            we can contribute to meaningful change as a community.
          </p>
        </section>

        {/* EdLD Program Section */}
        <section>
          <h2 className="font-serif text-2xl font-bold mb-4">The EdLD Program</h2>
          <p className="mb-6">
            The Doctor of Education Leadership (EdLD) program at Harvard Graduate School of Education is a three-year,
            practice-based doctorate designed to prepare transformative leaders in education. The program combines
            rigorous coursework with a year-long residency in an education organization.
          </p>
          <p className="mb-6">
            EdLD students and alumni are a diverse group of education professionals committed to improving educational
            opportunities and outcomes for all students. They work in a variety of roles and settings, including school
            districts, state and federal education agencies, nonprofit organizations, and education technology
            companies.
          </p>
        </section>

        {/* Join Community Section */}
        <section>
          <h2 className="font-serif text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="mb-4">
            If you are a current EdLD student or alumni, we invite you to join our community. By creating a profile on
            VERIVOX, you can:
          </p>
          <ul className="list-disc list-inside mb-6">
            <li>Share your professional background and accomplishments</li>
            <li>Connect with other EdLD students and alumni</li>
            <li>Publish articles and research to share your insights and experiences</li>
            <li>Stay informed about the work and achievements of your fellow EdLD community members</li>
          </ul>
          <div className="flex justify-center">
            {/* ✅ UPDATED: use the RegisterCTA which handles signup vs register */}
            <RegisterCTA />
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="font-serif text-2xl font-bold mb-4">Contact Us</h2>
          <p>
            If you have any questions or feedback about VERIVOX, please don't hesitate to contact us at{" "}
            <a href="mailto:ruizclark@gse.harvard.edu" className="text-harvard-crimson hover:underline">
              ruizclark@gse.harvard.edu
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
