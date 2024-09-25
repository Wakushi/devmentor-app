"use client"
import Filters from "@/components/pages/mentor-search/filters"
import MentorCard from "@/components/pages/mentor-search/mentor-card"
import Pagination from "@/components/pages/mentor-search/pagination"
import QuickMatchButton from "@/components/pages/mentor-search/quick-match-button"
import AnimatedBackground from "@/components/ui/animated-background"
import { MENTORS_MOCK } from "@/lib/mock/mentor-mocks"
import { Language, LearningField } from "@/lib/types/profile-form.type"
import { Mentor } from "@/lib/types/user.type"
import { getAverageRating } from "@/lib/utils"
import { useEffect, useState } from "react"

const MENTORS_PER_PAGE = 5

export default function MentorSearch() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [filters, setFilters] = useState({
    expertise: "All",
    language: "All",
    maxHourlyRate: "",
    freeSessionsOnly: false,
    minRating: 4,
  })

  function fetchMentors(): Mentor[] {
    return MENTORS_MOCK
  }

  const mentors = fetchMentors()

  useEffect(() => {
    const filtered = mentors.filter((mentor) => {
      const expertiseMatch =
        filters.expertise === "All" ||
        mentor.learningFields?.includes(filters.expertise as LearningField)

      const langMatch =
        filters.language === "All" ||
        mentor.languages?.includes(filters.language as Language)

      const hourlyRateMatch =
        filters.maxHourlyRate === "" ||
        mentor.hourlyRate <= parseInt(filters.maxHourlyRate)

      const freeSessionMatch =
        !filters.freeSessionsOnly || mentor.hourlyRate === 0

      const minRatingMatch =
        +getAverageRating(mentor.reviews) > filters.minRating

      return (
        expertiseMatch &&
        langMatch &&
        hourlyRateMatch &&
        freeSessionMatch &&
        minRatingMatch
      )
    })
    setFilteredMentors(filtered)
    setCurrentPage(1)
  }, [filters])

  const indexOfLastMentor = currentPage * MENTORS_PER_PAGE
  const indexOfFirstMentor = indexOfLastMentor - MENTORS_PER_PAGE
  const currentMentors = filteredMentors.slice(
    indexOfFirstMentor,
    indexOfLastMentor
  )

  const totalPages = Math.ceil(filteredMentors.length / MENTORS_PER_PAGE)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleFilterChange = (
    filterName: string,
    value: string | number | boolean
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }))
  }

  return (
    <div className="relative flex gap-4 pt-[7rem] min-h-screen m-auto w-[95%]">
      <Filters
        filters={filters}
        onFilterChange={handleFilterChange}
        mentors={mentors}
      />
      <div className="flex flex-col gap-4 ml-auto w-[80%]">
        <QuickMatchButton />
        {currentMentors.length ? (
          <MentorList mentors={currentMentors} />
        ) : (
          <div className="w-full p-8 flex items-center justify-center">
            <h3>No mentor available with these criterias</h3>
          </div>
        )}
        {!!currentMentors.length && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <AnimatedBackground shader={false} />
    </div>
  )
}

function MentorList({ mentors }: { mentors: Mentor[] }) {
  return (
    <div className="flex flex-col gap-4 fade-in-bottom">
      {mentors.map((mentor: Mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} />
      ))}
    </div>
  )
}
