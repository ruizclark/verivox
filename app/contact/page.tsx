// app/contact/page.tsx
"use client"

export default function ContactPage() {
  const email = "ruizclark@gse.harvard.edu"

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold mb-4">Contact</h1>

      <p className="text-muted-foreground mb-2">
        VERIVOX is a volunteer, student-led initiative created to amplify the voices of the EdLD
        community, and it operates independently from Harvard University. For questions or feedback,
        please contact the site administrator at:{" "}
        <a
          href={`mailto:${email}`}
          className="text-harvard-crimson underline"
        >
          {email}
        </a>.
      </p>

      <button
        onClick={() => navigator.clipboard.writeText(email)}
        className="mt-2 inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
      >
        Copy email to clipboard
      </button>
    </div>
  )
}

