export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  countryCode: string
  role: {
    _id: string
    name: string
  }
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  _id: string
  name: string
  description: string
  category: string
  price: number
  sizes: string[]
  colors: string[]
  quantity: number
  mainImage: string
  additionalImages: string[]
  ratings: {
    average: number
    count: number
  }
  reviews: {
    reviewerName: string
    rating: number
    comment: string
    createdAt: string
  }[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const dummyUsers: User[] = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "1234567890",
    countryCode: "+1",
    role: { _id: "role1", name: "Admin" },
    isEmailVerified: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phoneNumber: "0987654321",
    countryCode: "+1",
    role: { _id: "role2", name: "User" },
    isEmailVerified: true,
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    _id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    phoneNumber: "5551234567",
    countryCode: "+1",
    role: { _id: "role2", name: "User" },
    isEmailVerified: false,
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
  },
]

export const dummyProducts: Product[] = [
  {
    _id: "1",
    name: "Premium Cotton T-Shirt",
    description:
      "High-quality cotton t-shirt with comfortable fit and durable construction. Perfect for everyday wear.",
    category: "TSHIRTS",
    price: 29.99,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "white", "navy", "gray"],
    quantity: 150,
    mainImage: "/placeholder.svg?height=300&width=300",
    additionalImages: ["/placeholder.svg?height=300&width=300", "/placeholder.svg?height=300&width=300"],
    ratings: {
      average: 4.5,
      count: 23,
    },
    reviews: [
      {
        reviewerName: "Sarah Wilson",
        rating: 5,
        comment: "Great quality and comfortable fit!",
        createdAt: "2024-01-10T12:00:00Z",
      },
    ],
    isActive: true,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    _id: "2",
    name: "Classic Denim Jeans",
    description: "Comfortable denim jeans with classic fit and premium quality fabric.",
    category: "PANTS",
    price: 79.99,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["blue", "black", "gray"],
    quantity: 85,
    mainImage: "/placeholder.svg?height=300&width=300",
    additionalImages: ["/placeholder.svg?height=300&width=300"],
    ratings: {
      average: 4.2,
      count: 18,
    },
    reviews: [],
    isActive: true,
    createdAt: "2024-01-02T11:00:00Z",
    updatedAt: "2024-01-02T11:00:00Z",
  },
  {
    _id: "3",
    name: "Baseball Cap",
    description: "Adjustable baseball cap with embroidered logo and comfortable fit.",
    category: "CAPS",
    price: 24.99,
    sizes: ["ONE SIZE"],
    colors: ["black", "navy", "red", "white"],
    quantity: 200,
    mainImage: "/placeholder.svg?height=300&width=300",
    additionalImages: [],
    ratings: {
      average: 4.0,
      count: 12,
    },
    reviews: [],
    isActive: true,
    createdAt: "2024-01-03T09:00:00Z",
    updatedAt: "2024-01-03T09:00:00Z",
  },
]

export interface TAdminProfile {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  countryCode: string
  avatar?: string
  position: string
  department: string
  joinedDate: string
  lastLogin: string
  bio?: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  socialLinks: {
    linkedin?: string
    twitter?: string
    github?: string
  }
  preferences: {
    notifications: boolean
    darkMode: boolean
    language: string
  }
  createdAt: string
  updatedAt: string
}

export const dummyAdminProfile: TAdminProfile = {
  _id: "admin1",
  firstName: "John",
  lastName: "Admin",
  email: "admin@company.com",
  phoneNumber: "1234567890",
  countryCode: "+1",
  avatar: "/placeholder.svg?height=100&width=100",
  position: "System Administrator",
  department: "IT Department",
  joinedDate: "2023-01-15T00:00:00Z",
  lastLogin: "2024-01-20T10:30:00Z",
  bio: "Experienced system administrator with over 5 years in managing enterprise applications and user systems.",
  address: {
    street: "123 Admin Street",
    city: "Tech City",
    state: "California",
    zipCode: "90210",
    country: "United States",
  },
  socialLinks: {
    linkedin: "https://linkedin.com/in/johnadmin",
    twitter: "https://twitter.com/johnadmin",
    github: "https://github.com/johnadmin",
  },
  preferences: {
    notifications: true,
    darkMode: false,
    language: "English",
  },
  createdAt: "2023-01-15T00:00:00Z",
  updatedAt: "2024-01-20T10:30:00Z",
}
