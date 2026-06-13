export default function ChallengePage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">

        <p className="uppercase tracking-[0.3em] text-[#C8A165] text-sm">
          Coming Soon
        </p>

        <h1
          className="text-5xl md:text-7xl mt-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          FREE 10-Day Portrait Sketch Challenge
        </h1>

        <p className="mt-8 text-lg text-gray-600 max-w-2xl mx-auto">
          Learn portrait sketching through daily guided exercises,
          improve your skills, and compete for exciting rewards.
        </p>

        {/* Benefits */}

        <div className="grid md:grid-cols-2 gap-6 mt-16 text-left">

          <div className="bg-white p-6 rounded-3xl shadow-sm">
            <h3 className="font-semibold text-xl">
              Daily Sketching Tasks
            </h3>

            <p className="mt-3 text-gray-600">
              Receive a new challenge every day and steadily improve your skills.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm">
            <h3 className="font-semibold text-xl">
              Skill Improvement
            </h3>

            <p className="mt-3 text-gray-600">
              Learn portrait proportions, shading, textures, and realism.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm">
            <h3 className="font-semibold text-xl">
              Community Competition
            </h3>

            <p className="mt-3 text-gray-600">
              Earn points through challenge submissions and climb the leaderboard.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm">
            <h3 className="font-semibold text-xl">
              Personal Feedback
            </h3>

            <p className="mt-3 text-gray-600">
              Get guidance and tips throughout the challenge.
            </p>
          </div>

        </div>

        {/* Reward */}

        <div className="mt-16 bg-black text-white p-10 rounded-3xl">
          <h2 className="text-3xl font-semibold">
            Reward
          </h2>

          <p className="mt-4 text-gray-300">
            Top 2 participants with the highest points will receive:
          </p>

          <p className="mt-6 text-2xl text-[#C8A165]">
            FREE 1-on-1 Online Sketching Class with Prem
          </p>
        </div>

        {/* Waitlist */}

        <div className="mt-16 bg-white rounded-3xl p-10 shadow-sm">

          <h2 className="text-3xl font-semibold">
            Reserve Your Spot
          </h2>

          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Join the waitlist today and be among the first participants when the
            FREE 10-Day Portrait Sketch Challenge officially launches.
          </p>

          <div className="mt-8">
            <a
              href="https://17439a40.sibforms.com/serve/MUIFAHvkXc-aupXHor5qd1UNk3Phn84bG-p2lpk-jsWBjscyImbm_U2EXFNMkSTHDRfOL5nD5Bm8-nTVUCVsxBisjDlBmnbif7YRmbZDa3xF6Srgj109mfgQUn7Ve2M0UlBMjEAZCJyw_f9C51LRv0XsTece4-ZaTS5m39W_EB_O5kVix8K3I6V_P9cyw42xKLA6LFrS8zJ-TWuvCQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#C8A165] text-white px-10 py-4 rounded-full hover:scale-105 transition duration-300"
            >
              Join Waitlist
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            You'll receive an email notification as soon as registration opens.
          </p>

        </div>

      </div>
    </main>
  );
}