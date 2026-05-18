'use client'

import Link from 'next/link'

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-white font-bold text-xl">DevInsight AI</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
              <Link href="/documentation" className="text-white font-semibold">Documentation</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Documentation Content */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
          <p className="text-gray-400 mb-12">Everything you need to know about DevInsight AI</p>

          {/* Getting Started */}
          <section className="mb-12">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="text-3xl mr-3">🚀</span>
                Getting Started
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>DevInsight AI is an AI-powered code review platform that helps you write better code faster.</p>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-semibold mb-2">Quick Start:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Connect your GitHub repository</li>
                    <li>Configure your review preferences</li>
                    <li>Start your first automated review</li>
                    <li>Review AI-generated insights and recommendations</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="mb-12">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="text-3xl mr-3">✨</span>
                Key Features
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'AI Analysis', desc: 'Powered by IBM watsonx AI for intelligent insights' },
                  { title: 'Real-time Feedback', desc: 'Get instant code quality assessments' },
                  { title: 'Security Scanning', desc: 'Detect vulnerabilities automatically' },
                  { title: 'Performance Metrics', desc: 'Track code quality over time' },
                  { title: 'Team Collaboration', desc: 'Share reviews with your team' },
                  { title: 'Custom Rules', desc: 'Define your own coding standards' }
                ].map((feature, index) => (
                  <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* API Reference */}
          <section className="mb-12">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="text-3xl mr-3">📚</span>
                API Reference
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-semibold mb-2">POST /api/reviews</h3>
                  <p className="text-gray-400 text-sm mb-2">Create a new code review</p>
                  <pre className="bg-gray-950 p-3 rounded text-green-400 text-sm overflow-x-auto">
{`{
  "repository": "username/repo",
  "branch": "main",
  "files": ["src/**/*.js"]
}`}
                  </pre>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-semibold mb-2">GET /api/reviews/:id</h3>
                  <p className="text-gray-400 text-sm">Retrieve review results and insights</p>
                </div>
              </div>
            </div>
          </section>

          {/* Support */}
          <section>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
              <p className="text-blue-100 mb-6">Our support team is here to assist you</p>
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
                Contact Support
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

// Made with Bob
