import { QueryKeys } from "@/lib/types/query-keys.type"
import { Mentor } from "@/lib/types/user.type"
import { getAllMentors, getMentor } from "@/services/contract.service"
import { useQuery } from "@tanstack/react-query"

export default function useMentorsQuery() {
  const mentorsQuery = useQuery<Mentor[], Error>({
    queryKey: [QueryKeys.MENTORS],
    queryFn: async () => {
      const mentorsAddresses = await getAllMentors()

      const mentors: Mentor[] = []

      for (let mentorAddress of mentorsAddresses) {
        const mentor = await getMentor(mentorAddress)
        mentors.push(mentor)
      }

      return mentors
    },
  })

  return mentorsQuery
}
