import { getAllMentors, getMentor } from "@/lib/actions/web3/contract"
import { QueryKeys } from "@/lib/types/query-keys.type"
import { MentorStruct } from "@/lib/types/user.type"
import { useQuery } from "@tanstack/react-query"

export default function useMentorsQuery() {
  const mentorsQuery = useQuery<MentorStruct[], Error>({
    queryKey: [QueryKeys.MENTORS],
    queryFn: async () => {
      const mentorsAddresses = await getAllMentors()

      const mentors: MentorStruct[] = []

      for (let mentorAddress of mentorsAddresses) {
        const mentor = await getMentor(mentorAddress)
        mentors.push(mentor)
      }

      return mentors
    },
  })

  return mentorsQuery
}
