'use client'

import Link from 'next/link'

export default function Dashboard() {
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
              <Link href="/dashboard" className="text-white font-semibold">Dashboard</Link>
              <Link href="/documentation" className="text-gray-300 hover:text-white transition">Documentation</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Reviews', value: '156', icon: '📊', color: 'from-blue-500 to-cyan-500' },
              { label: 'Active Projects', value: '12', icon: '🚀', color: 'from-purple-500 to-pink-500' },
              { label: 'Issues Found', value: '43', icon: '🔍', color: 'from-orange-500 to-red-500' },
              { label: 'Code Quality', value: '94%', icon: '✨', color: 'from-green-500 to-emerald-500' }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Reviews */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Reviews</h2>
            <div className="space-y-4">
              {[
                { repo: 'frontend-app', status: 'Completed', score: 95, time: '2 hours ago' },
                { repo: 'backend-api', status: 'In Progress', score: 88, time: '5 hours ago' },
                { repo: 'mobile-app', status: 'Completed', score: 92, time: '1 day ago' }
              ].map((review, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">📁</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{review.repo}</div>
                      <div className="text-gray-400 text-sm">{review.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-white font-semibold">Score: {review.score}%</div>
                      <div className={`text-sm ${review.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {review.status}
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Made with Bob
