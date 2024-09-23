"use client"
import React, { useState } from "react"

const SessionBookingPage = () => {
  const [step, setStep] = useState(1)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isPaid, setIsPaid] = useState(true) // Toggle this for testing free/paid scenarios

  const handleTimeSelection = () => {
    setSelectedTime("2023-09-25 14:00")
    setStep(2)
  }

  const handlePayment = () => {
    // Simulate payment process
    alert("Payment processed successfully!")
    // Enable validation button
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Book a Session</h1>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column - Mentor Details */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-start mb-4">
            <img
              src="/api/placeholder/80/80"
              alt="Mentor"
              className="rounded-full mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">Jane Doe</h2>
              <p className="text-sm text-gray-600">
                Blockchain Expert | ⭐️ 4.9 (120 reviews)
              </p>
              <p className="text-sm text-gray-600">
                Languages: English, Spanish
              </p>
              <p className="text-sm font-semibold text-green-600">
                {isPaid ? "$50/hour" : "Free sessions"}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Jane is an experienced blockchain developer with 5 years of
            experience in smart contract development and DeFi applications.
          </p>
          {selectedTime && (
            <div className="mt-4 p-3 bg-blue-100 rounded">
              <h3 className="font-semibold">Selected Time:</h3>
              <p>{selectedTime}</p>
            </div>
          )}
        </div>

        {/* Right Column - Booking Process */}
        <div className="bg-white p-4 rounded shadow">
          {step === 1 ? (
            <>
              <h3 className="text-lg font-semibold mb-4">
                Select a Date and Time
              </h3>
              {/* Placeholder for date/time picker */}
              <div className="bg-gray-200 p-4 mb-4 text-center">
                Date/Time Picker Component
              </div>
              <button
                onClick={handleTimeSelection}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded"
              >
                Confirm Time Slot
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
              {isPaid ? (
                <>
                  <p className="mb-4">Total Amount: $50.00</p>
                  <button
                    onClick={handlePayment}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded mb-2"
                  >
                    Lock Funds for Session
                  </button>
                </>
              ) : null}
              <button
                className={`w-full ${
                  isPaid ? "bg-gray-300" : "bg-blue-500"
                } text-white px-4 py-2 rounded`}
                disabled={isPaid}
              >
                Validate Session Booking
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SessionBookingPage
