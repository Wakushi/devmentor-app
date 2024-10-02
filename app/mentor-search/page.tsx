"use client"
import Filters from "@/components/pages/mentor-search/filters"
import MentorCard, {
  MentorCardSkeleton,
} from "@/components/pages/mentor-search/mentor-card"
import Pagination from "@/components/pages/mentor-search/pagination"
import QuickMatchButton from "@/components/pages/mentor-search/quick-match-button"
import AnimatedBackground from "@/components/ui/animated-background"
import useMentorsQuery from "@/hooks/queries/mentors-query"
import { matchQueryStatus } from "@/lib/matchQueryStatus"
import { Language, LearningField } from "@/lib/types/profile-form.type"
import { MentorStruct } from "@/lib/types/user.type"
import {
  getAverageRating,
  getLanguagesFromIds,
  getSubjectsFromIds,
} from "@/lib/utils"
import { useEffect, useState } from "react"

const MENTORS_PER_PAGE = 5

export default function MentorSearch() {
  const mentorsQuery = useMentorsQuery()
  const { data: mentors } = mentorsQuery

  const [currentPage, setCurrentPage] = useState(1)
  const [filteredMentors, setFilteredMentors] = useState<MentorStruct[]>([])
  const [filters, setFilters] = useState({
    expertise: "All",
    language: "All",
    maxHourlyRate: "",
    freeSessionsOnly: false,
    minRating: 0,
  })

  useEffect(() => {
    if (!mentors) return

    const filtered = mentors.filter((mentor) => {
      const expertiseMatch =
        filters.expertise === "All" ||
        getSubjectsFromIds(mentor.baseUser.subjects)?.includes(
          filters.expertise as LearningField
        )

      const langMatch =
        filters.language === "All" ||
        getLanguagesFromIds(mentor.baseUser.languages)?.includes(
          filters.language as Language
        )

      const hourlyRateMatch =
        filters.maxHourlyRate === "" ||
        mentor.hourlyRate <= parseInt(filters.maxHourlyRate)

      const freeSessionMatch =
        !filters.freeSessionsOnly || mentor.hourlyRate === 0

      const minRatingMatch =
        +getAverageRating(mentor.reviews) >= filters.minRating

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
  }, [mentors, filters])

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
    <div className="relative flex gap-4 pt-header-distance min-h-screen m-auto w-[95%]">
      <Filters
        filters={filters}
        onFilterChange={handleFilterChange}
        mentors={mentors || []}
      />
      <div className="flex flex-col gap-4 ml-auto w-full">
        <QuickMatchButton />

        {matchQueryStatus(mentorsQuery, {
          Loading: (
            <div className="flex flex-col gap-4">
              <MentorCardSkeleton />
              <MentorCardSkeleton />
              <MentorCardSkeleton />
              <MentorCardSkeleton />
            </div>
          ),
          Errored: <p>Something wrong happened</p>,
          Empty: (
            <div className="w-full p-8 flex items-center justify-center">
              <h3>No mentor available with these criterias</h3>
            </div>
          ),
          Success: () => (
            <>
              <MentorList mentors={currentMentors} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ),
        })}
      </div>

      <AnimatedBackground shader={false} />
    </div>
  )
}

function MentorList({ mentors }: { mentors: MentorStruct[] }) {
  return (
    <div className="flex flex-col gap-4">
      {mentors.map((mentor: MentorStruct) => (
        <MentorCard key={mentor.account} mentor={mentor} />
      ))}
    </div>
  )
}
