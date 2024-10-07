import React from "react"
import { Clock, Video, Calendar, User } from "lucide-react"

const PreSessionReminder = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Upcoming Session</h1>

      <div className="bg-white p-6 rounded-md shadow max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">Your session starts in</h2>
          <div className="text-4xl font-bold text-blue-600">00:15:32</div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center">
            <User className="mr-4 text-gray-500" />
            <div>
              <p className="font-semibold">Mentor</p>
              <p>John Doe - Blockchain Expert</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-4 text-gray-500" />
            <div>
              <p className="font-semibold">Date & Time</p>
              <p>September 25, 2023 - 2:00 PM EST</p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="mr-4 text-gray-500" />
            <div>
              <p className="font-semibold">Duration</p>
              <p>1 hour</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition duration-300"
          >
            <Video className="mr-2" />
            Join Video Call
          </a>
          <p className="mt-2 text-sm text-dim">
            Make sure your camera and microphone are working before joining.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PreSessionReminder
