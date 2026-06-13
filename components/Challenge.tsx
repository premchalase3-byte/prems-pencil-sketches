"use client";

import { useState } from "react";

export default function Challenge() {
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-28 px-6 bg-[#F8F5F0]">
      <div className="max-w-4xl mx-auto text-center">

        <p className="uppercase tracking-[0.3em] text-[#C8A165] text-sm">
          Coming Soon
        </p>

        <h2
          className="text-4xl md:text-6xl mt-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          FREE 10-Day Portrait Sketch Challenge
        </h2>

        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          Learn portrait sketching through daily challenges,
          improve your skills, and compete for exciting rewards.
        </p>

        <div className="mt-10 space-y-3 text-gray-700">
          <p>✓ Daily sketching tasks</p>
          <p>✓ Skill improvement roadmap</p>
          <p>✓ Personal feedback opportunities</p>
          <p>✓ Free participation</p>
        </div>

        <div className="mt-10 bg-black text-white rounded-3xl p-8">
          <h3 className="text-2xl font-semibold">
            Reward for Top Participants
          </h3>

          <p className="mt-4 text-gray-300">
            Top 2 participants with the highest points will win:
          </p>

          <p className="mt-4 text-xl text-[#C8A165]">
            FREE 1-on-1 Online Sketching Class with Prem
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-10 bg-[#C8A165] text-white px-8 py-4 rounded-full hover:scale-105 transition"
        >
          Reserve Your Spot
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center px-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full">

            {!submitted ? (
              <>
                <h3 className="text-2xl font-semibold">
                  Join the Waitlist
                </h3>

                <p className="text-gray-600 mt-2">
                  Be the first to know when registration opens.
                </p>

                <form
                  action="https://formsubmit.co/premchalase3@gmail.com"
                  method="POST"
                  onSubmit={() => setSubmitted(true)}
                  className="mt-6 space-y-4"
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="w-full border p-3 rounded-xl"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    className="w-full border p-3 rounded-xl"
                  />

                  <button
                    type="submit"
                    className="w-full bg-[#C8A165] text-white py-3 rounded-xl"
                  >
                    Reserve My Spot
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold">
                  You're In!
                </h3>

                <p className="mt-4 text-gray-600">
                  The challenge is launching soon.
                </p>

                <p className="mt-2 text-gray-600">
                  You'll receive an email when registrations officially open.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}