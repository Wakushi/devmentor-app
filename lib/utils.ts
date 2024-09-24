import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address } from "viem"
import { Review } from "./types/review.type"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: Address): string {
  if (!address) {
    throw new Error("Invalid address")
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function getAverageRating(reviews: Review[]) {
  const sum = reviews.reduce((acc, review) => acc + review.rate, 0)
  return (sum / reviews.length).toFixed(1)
}
