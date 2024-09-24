import AnimatedBackground from "@/components/ui/animated-background"
import { Button } from "@/components/ui/button"
import { IoIosFlash } from "react-icons/io"

export default function MentorSearch() {
  return (
    <div className="p-4 pt-40 min-h-screen m-auto w-[90%]">
      <h1 className="text-2xl font-bold mb-6">Find Your Mentor</h1>

      <div className="flex gap-4">
        {/* Filters Sidebar */}
        <Filters />
        {/* Mentor List and Quick Match */}
        <div className="flex-3 flex flex-col gap-4">
          <QuickMatchButton />

          <div className="glass p-4 rounded shadow">
            <div className="flex items-start">
              <img
                src="/api/placeholder/80/80"
                alt="Mentor"
                className="rounded-full mr-4"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">Jane Doe</h3>
                <p className="text-sm text-gray-600">
                  Blockchain Expert | ⭐️ 4.9 (120 reviews)
                </p>
                <p className="text-sm text-gray-600">
                  Languages: English, Spanish
                </p>
                <p className="text-sm font-semibold text-green-600">$50/hour</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-600 mb-2">
                  Rank: #1
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Book Paid Session
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded shadow">
            <div className="flex items-start">
              <img
                src="/api/placeholder/80/80"
                alt="Mentor"
                className="rounded-full mr-4"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">John Smith</h3>
                <p className="text-sm text-gray-600">
                  Smart Contract Developer | ⭐️ 4.7 (85 reviews)
                </p>
                <p className="text-sm text-gray-600">
                  Languages: English, Mandarin
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Free sessions
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-600 mb-2">
                  Rank: #2
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  Book Free Session
                </button>
              </div>
            </div>
          </div>

          {/* More mentor cards... */}

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            <button className="px-4 py-2 border rounded">Previous</button>
            <button className="px-4 py-2 border rounded bg-blue-500 text-white">
              1
            </button>
            <button className="px-4 py-2 border rounded">2</button>
            <button className="px-4 py-2 border rounded">3</button>
            <button className="px-4 py-2 border rounded">Next</button>
          </div>
        </div>
      </div>
      <AnimatedBackground shader={false} />
    </div>
  )
}

function Filters() {
  return (
    <div className="flex-1 glass p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expertise
          </label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option>All</option>
            <option>Blockchain</option>
            <option>Smart Contracts</option>
            <option>DeFi</option>
            {/* Add more options */}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option>All</option>
            <option>English</option>
            <option>Spanish</option>
            <option>Mandarin</option>
            {/* Add more options */}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Hourly Rate
          </label>
          <input
            type="number"
            placeholder="USD"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 shadow-sm"
            />
            <span className="ml-2 text-sm text-gray-600">
              Free sessions only
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}

function QuickMatchButton() {
  return (
    <div className="glass flex flex-col items-center justify-center p-8 rounded shadow text-center">
      <Button className="flex text-body items-center gap-2 px-6 py-3 rounded-full">
        <IoIosFlash />
        Quick Match with Free Mentor
      </Button>
      <p className="text-sm text-gray-600 mt-2">
        Instantly connect with an available free mentor
      </p>
    </div>
  )
}
