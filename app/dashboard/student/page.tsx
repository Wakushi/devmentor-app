"use client"
import React, { useState } from "react"
import {
  Clock,
  Video,
  Calendar,
  User,
  Star,
  DollarSign,
  AlertTriangle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import AnimatedBackground from "@/components/ui/animated-background"
import { useUser } from "@/services/user.service"
import LoadingScreen from "@/components/ui/loading-screen"
import NavLinkButton from "@/components/ui/nav-link"
import { FaLongArrowAltRight } from "react-icons/fa"

export default function DashboardPage() {
  const { user, loadingUser } = useUser()
  const [showPreSessionModal, setShowPreSessionModal] = useState(false)
  const [showPostSessionModal, setShowPostSessionModal] = useState(false)
  const [rating, setRating] = useState(0)

  if (loadingUser || !user) {
    return <LoadingScreen />
  }

  const PreSessionModal = () => (
    <AlertDialog
      open={showPreSessionModal}
      onOpenChange={setShowPreSessionModal}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upcoming Session</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-blue-600">00:15:32</div>
              <p>until your session starts</p>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <p>John Doe - Blockchain Expert</p>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <p>September 25, 2023 - 2:00 PM EST</p>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <p>Duration: 1 hour</p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction className="bg-green-500 hover:bg-green-600">
            <Video className="mr-2 h-4 w-4" />
            Join Video Call
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  const PostSessionModal = () => (
    <AlertDialog
      open={showPostSessionModal}
      onOpenChange={setShowPostSessionModal}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session Feedback</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-2">How would you rate this session?</p>
            <div className="flex space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  onClick={() => setRating(star)}
                  fill={star <= rating ? "#FFD700" : "none"}
                  stroke={star <= rating ? "#FFD700" : "currentColor"}
                  className="cursor-pointer"
                />
              ))}
            </div>
            <textarea
              rows={3}
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Share your thoughts about the session..."
            ></textarea>
            <div className="flex items-center mb-4">
              <DollarSign size={24} className="text-green-500 mr-2" />
              <input
                type="number"
                className="p-2 border rounded-md w-24"
                placeholder="Tip amount"
              />
              <span className="ml-2">USD</span>
            </div>
            <button className="flex items-center text-red-500">
              <AlertTriangle size={16} className="mr-2" />
              Report an issue
            </button>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Submit Feedback</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return (
    <div className="p-4 pt-40 min-h-screen m-auto w-[90%]">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user.name} !</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upcoming Sessions */}
        <div className="glass border border-stone-800 p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>Blockchain Basics with John Doe</span>
              <button
                onClick={() => setShowPreSessionModal(true)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
              >
                View Details
              </button>
            </li>
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="glass border border-stone-800 p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>Session completed with Jane Smith</span>
              <button
                onClick={() => setShowPostSessionModal(true)}
                className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
              >
                Leave Feedback
              </button>
            </li>
          </ul>
        </div>

        {/* Learning Progress */}
        <div className="glass border border-stone-800 p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
          <p>You've completed 5 sessions this month!</p>
        </div>

        {/* Quick Actions */}
        <div className="glass border border-stone-800 p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <div className="w-full">
              <NavLinkButton variant="filled" href="/mentor-search">
                Find a Mentor <FaLongArrowAltRight />
              </NavLinkButton>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PreSessionModal />
      <PostSessionModal />
      <AnimatedBackground shader={false} />
    </div>
  )
}
