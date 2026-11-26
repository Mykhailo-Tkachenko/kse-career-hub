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
  isActive: boolean
}

// Поля, які компанія заповнює у формі вакансії
export type ListingInput = Pick<
  Listing,
  'title' | 'type' | 'location' | 'remote' | 'category' | 'description' | 'requirements'
>

export interface Company {
  id: string
  name: string
  logo: string
  industry: string
  description: string
}

export type UserRole = 'student' | 'company'

export interface Application {
  id: string
  listingId: string
  applicantEmail: string
  cvPath: string
  createdAt: string
}
