export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          DevInsight AI
        </h1>
        <p className="text-xl text-center mb-4">
          AI-Powered Code Review Platform
        </p>
        <p className="text-center text-gray-600">
          Automated code review and analysis powered by IBM watsonx AI
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </a>
          <a
            href="/documentation"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Documentation
          </a>
        </div>
      </div>
    </main>
  )
}

// Made with Bob
