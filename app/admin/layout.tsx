// app/admin/layout.tsx

// This is the layout for the admin dashboard
export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        {children}
      </div>
    )
  }
  