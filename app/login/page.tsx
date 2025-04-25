"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the form data to your backend
    console.log("Form submitted:", formData)
    // Redirect to the user's profile page
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-md">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <Image src="/images/verivox-logo.png" alt="VERIVOX Logo" width={80} height={80} className="h-20 w-auto" />
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold tracking-tighter">Welcome Back</h1>
            <p className="text-muted-foreground">Log in to your VERIVOX account</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Log In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-harvard-crimson hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-harvard-crimson focus:ring-harvard-crimson"
                />
                <Label htmlFor="rememberMe" className="text-sm">
                  Remember me
                </Label>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-harvard-crimson hover:bg-harvard-crimson/90"
              onClick={handleSubmit}
            >
              Log In
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-harvard-crimson hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
