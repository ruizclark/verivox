import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <Image src="/images/verivox-logo.png" alt="VERIVOX Logo" width={120} height={120} className="h-32 w-auto" />
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About VERIVOX</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Amplifying the Voices of the EdLD Community
            </p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            VERIVOX was launched in 2025 as a space to amplify the voices of the EdLD community. To join the platform,
            you must be a current student or alumni of the Doctor of Education Leadership program at the Harvard
            Graduate School of Education.
          </p>

          <h2 className="font-serif">Our Mission</h2>
          <p>
            Our mission is to create a platform where EdLD students and alumni can share their research, insights, and
            experiences with each other and the broader education community. We believe that by amplifying these voices,
            we can contribute to meaningful change in education.
          </p>

          <h2 className="font-serif">The EdLD Program</h2>
          <p>
            The Doctor of Education Leadership (EdLD) program at Harvard Graduate School of Education is a three-year,
            practice-based doctorate designed to prepare transformative leaders in education. The program combines
            rigorous coursework with a year-long residency in an education organization.
          </p>
          <p>
            EdLD students and alumni are a diverse group of education professionals committed to improving educational
            opportunities and outcomes for all students. They work in a variety of roles and settings, including school
            districts, state and federal education agencies, nonprofit organizations, and education technology
            companies.
          </p>

          <h2 className="font-serif">Join Our Community</h2>
          <p>
            If you are a current EdLD student or alumni, we invite you to join our community. By creating a profile on
            VERIVOX, you can:
          </p>
          <ul>
            <li>Share your professional background and accomplishments</li>
            <li>Connect with other EdLD students and alumni</li>
            <li>Publish articles and research to share your insights and experiences</li>
            <li>Stay informed about the work and achievements of your fellow EdLD community members</li>
          </ul>
          <p>
            To join, simply click the "Register" button below and follow the instructions to create your account. Your
            account will be verified to ensure that you are a member of the EdLD community.
          </p>

          <div className="flex justify-center my-8">
            <Link href="/register">
              <Button size="lg" className="bg-harvard-crimson hover:bg-harvard-crimson/90">
                Register Now
              </Button>
            </Link>
          </div>

          <h2 className="font-serif">Contact Us</h2>
          <p>
            If you have any questions or feedback about VERIVOX, please don't hesitate to contact us at{" "}
            <a href="mailto:info@verivox.org" className="text-harvard-crimson hover:underline">
              info@verivox.org
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
