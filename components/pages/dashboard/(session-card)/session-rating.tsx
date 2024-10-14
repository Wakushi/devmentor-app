"use client"
import { useState } from "react"
import { FaStar } from "react-icons/fa"

interface RatingSystemProps {
  rating: number
  setRating: (rating: number) => void
}

interface StarProps {
  isFilled: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
}

function Star(props: StarProps) {
  const style = props.isFilled
    ? { color: "var(--primary)" }
    : { color: "var(--dim)" }

  return (
    <span
      className="text-[2.5rem] cursor-pointer"
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onClick={props.onClick}
      style={style}
    >
      <FaStar />
    </span>
  )
}

export default function SessionRating({
  rating,
  setRating,
}: RatingSystemProps) {
  const [hoveredRating, setHoveredRating] = useState<number>(0)

  function handleMouseEnter(index: number) {
    setHoveredRating(index)
  }

  function handleMouseLeave() {
    setHoveredRating(0)
  }

  function handleClick(index: number) {
    setRating(index)
  }

  function getRatingText(rating: number) {
    switch (rating) {
      case 1:
        return "Poor"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
        return "Very Good"
      case 5:
        return "Excellent"
      default:
        return "Rate your experience"
    }
  }

  const displayRating = hoveredRating || rating

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            isFilled={index <= (hoveredRating || rating)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
      <p className="mt-2 text-sm ">{getRatingText(displayRating)}</p>
    </div>
  )
}
