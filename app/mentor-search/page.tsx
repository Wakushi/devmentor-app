"use client"
import Filters from "@/components/pages/mentor-search/filters"
import MentorCard from "@/components/pages/mentor-search/mentor-card"
import Pagination from "@/components/pages/mentor-search/pagination"
import QuickMatchButton from "@/components/pages/mentor-search/quick-match-button"
import AnimatedBackground from "@/components/ui/animated-background"
import { MENTORS_MOCK } from "@/lib/mock/mentor-mocks"
import { Language, LearningField } from "@/lib/types/profile-form.type"
import { Mentor } from "@/lib/types/user.type"
import { useEffect, useState } from "react"

const MENTORS_PER_PAGE = 5

export default function MentorSearch() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>(MENTORS_MOCK)
  const [filters, setFilters] = useState({
    expertise: "All",
    language: "All",
    maxHourlyRate: "",
    freeSessionsOnly: false,
  })

  useEffect(() => {
    const filtered = MENTORS_MOCK.filter((mentor) => {
      return (
        (filters.expertise === "All" ||
          mentor.learningFields?.includes(
            filters.expertise as LearningField
          )) &&
        (filters.language === "All" ||
          mentor.languages?.includes(filters.language as Language)) &&
        (filters.maxHourlyRate === "" ||
          mentor.hourlyRate <= parseInt(filters.maxHourlyRate)) &&
        (!filters.freeSessionsOnly || mentor.hourlyRate === 0)
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

  const handleFilterChange = (filterName: string, value: string | boolean) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }))
  }
  return (
    <div className="relative flex gap-4 p-4 pt-40 min-h-screen m-auto w-[95%]">
      <Filters
        filters={filters}
        onFilterChange={handleFilterChange}
        mentors={MENTORS_MOCK}
      />
      <div className="flex flex-col gap-4 ml-auto w-[80%]">
        <QuickMatchButton />
        <div className="flex flex-col gap-4">
          {currentMentors.map((mentor: Mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <AnimatedBackground shader={false} />
    </div>
  )
}
