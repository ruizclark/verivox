import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, Tag, Share2 } from "lucide-react"

export default function ArticlePage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the article data based on the ID
  const article = {
    id: params.id,
    title: "Transforming Education Through Leadership and Innovation",
    author: "Dr. Jane Smith",
    authorId: "profile-1",
    date: "June 15, 2025",
    category: "Leadership",
    image: "/placeholder.svg?height=400&width=800&text=Article+Image",
    content: `
      <p>Educational leadership has never been more important than it is today. As we face unprecedented challenges in our education systems, from addressing equity gaps to preparing students for a rapidly changing future, effective leadership is essential for driving meaningful change.</p>
      
      <h2>The Changing Landscape of Education</h2>
      
      <p>The landscape of education is evolving rapidly. Technological advancements, shifting demographics, and changing workforce demands are all reshaping what students need to learn and how they learn it. Educational leaders must be adaptable, forward-thinking, and committed to continuous improvement to navigate these changes effectively.</p>
      
      <p>In the Doctor of Education Leadership (EdLD) program at Harvard Graduate School of Education, we explore these challenges and develop the skills and knowledge needed to address them. Through a combination of coursework, practical experiences, and research, EdLD students and alumni are prepared to lead transformative change in education.</p>
      
      <h2>Innovation as a Driver of Change</h2>
      
      <p>Innovation is a key driver of change in education. By embracing new approaches, technologies, and ideas, educational leaders can create more effective, equitable, and engaging learning experiences for all students. However, innovation must be purposeful and aligned with clear goals for student learning and development.</p>
      
      <p>Effective educational leaders foster a culture of innovation in their organizations. They encourage experimentation, provide resources and support for new initiatives, and create opportunities for collaboration and knowledge-sharing. They also ensure that innovations are evaluated rigorously and scaled thoughtfully.</p>
      
      <h2>Leadership for Equity</h2>
      
      <p>Equity must be at the center of educational leadership. Despite decades of reform efforts, significant disparities in educational opportunities and outcomes persist along lines of race, socioeconomic status, language, and disability. Addressing these disparities requires leaders who are committed to equity and skilled in implementing equity-focused strategies.</p>
      
      <p>EdLD students and alumni are developing and implementing innovative approaches to advancing equity in education. From redesigning school funding systems to creating more inclusive curricula to implementing restorative justice practices, they are working to create education systems that serve all students well.</p>
      
      <h2>Conclusion</h2>
      
      <p>Transforming education through leadership and innovation is both a challenge and an opportunity. It requires vision, courage, and a deep commitment to equity and excellence. As members of the EdLD community, we are dedicated to developing and supporting leaders who can drive this transformation and create better educational opportunities for all students.</p>
    `,
    relatedArticles: [
      {
        id: "article-2",
        title: "Policy Implications for Educational Equity in Urban Schools",
        image: "/placeholder.svg?height=200&width=400&text=Related+Article+1",
      },
      {
        id: "article-3",
        title: "Building Inclusive Learning Environments for All Students",
        image: "/placeholder.svg?height=200&width=400&text=Related+Article+2",
      },
    ],
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        {/* Article Header */}
        <div className="mb-8 space-y-4">
          <Link href="/articles" className="text-harvard-crimson hover:underline">
            ← Back to Articles
          </Link>
          <h1 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <Link href={`/profiles/${article.authorId}`} className="hover:text-harvard-crimson hover:underline">
                {article.author}
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>{article.category}</span>
            </div>
          </div>
        </div>

        {/* Article Image */}
        <div className="mb-8 overflow-hidden rounded-lg">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            width={800}
            height={400}
            className="w-full"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

        {/* Share */}
        <div className="my-8 flex items-center justify-between border-t border-b py-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Share this article:</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
          <Link href={`/profiles/${article.authorId}`}>
            <Button variant="outline" size="sm">
              View Author Profile
            </Button>
          </Link>
        </div>

        {/* Related Articles */}
        <div className="my-12">
          <h2 className="font-serif text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {article.relatedArticles.map((related) => (
              <Link href={`/articles/${related.id}`} key={related.id}>
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={related.image || "/placeholder.svg"}
                      alt={related.title}
                      width={400}
                      height={200}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-serif text-lg font-bold">{related.title}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
