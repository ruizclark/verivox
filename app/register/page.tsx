"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    graduationYear: "",
    isCurrentStudent: false,
    acceptTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the form data to your backend
    console.log("Form submitted:", formData)
    // Redirect to a success page or show a success message
    setStep(3)
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-md">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <Image src="/images/verivox-logo.png" alt="VERIVOX Logo" width={80} height={80} className="h-20 w-auto" />
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold tracking-tighter">Join VERIVOX</h1>
            <p className="text-muted-foreground">Create your account to connect with the EdLD community</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">
              {step === 1 ? "Account Information" : step === 2 ? "EdLD Verification" : "Registration Complete"}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Enter your personal information to create an account"
                : step === 2
                  ? "Verify your EdLD affiliation"
                  : "Your account has been created successfully"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  <p className="text-xs text-muted-foreground">Please use your Harvard email if possible</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </form>
            )}

            {step === 2 && (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year (Actual or Expected)</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("graduationYear", value)}
                    value={formData.graduationYear}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => 2010 + i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isCurrentStudent"
                    checked={formData.isCurrentStudent}
                    onCheckedChange={(checked) => handleCheckboxChange("isCurrentStudent", checked as boolean)}
                  />
                  <Label htmlFor="isCurrentStudent">I am a current EdLD student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleCheckboxChange("acceptTerms", checked as boolean)}
                    required
                  />
                  <Label htmlFor="acceptTerms">
                    I agree to the{" "}
                    <Link href="/terms" className="text-harvard-crimson hover:underline">
                      terms and conditions
                    </Link>
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Note: Your account will be verified by an administrator before you can publish content.
                </p>
              </form>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-8 w-8 text-green-600"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold">Registration Successful!</h3>
                <p className="text-center text-muted-foreground">
                  Thank you for registering with VERIVOX. Your account is pending verification. You will receive an
                  email when your account is approved.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step === 1 ? (
              <>
                <Link href="/">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button onClick={nextStep}>Next</Button>
              </>
            ) : step === 2 ? (
              <>
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={handleSubmit} className="bg-harvard-crimson hover:bg-harvard-crimson/90">
                  Register
                </Button>
              </>
            ) : (
              <Link href="/" className="w-full">
                <Button className="w-full bg-harvard-crimson hover:bg-harvard-crimson/90">Return to Home</Button>
              </Link>
            )}
          </CardFooter>
        </Card>

        {step !== 3 && (
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-harvard-crimson hover:underline">
              Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
