export type ListingType = 'internship' | 'part-time' | 'full-time'

export interface Listing {
  id: string
  title: string
  company: string
  companyLogo: string
  type: ListingType
  location: string
  remote: boolean
  category: string
  description: string
  requirements: string[]
  postedAt: string
  applicants: number
}

export interface Company {
  id: string
  name: string
  logo: string
  industry: string
  description: string
}

export type UserRole = 'student' | 'company'
