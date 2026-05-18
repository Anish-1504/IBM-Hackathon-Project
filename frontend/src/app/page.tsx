'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Leverage IBM watsonx AI for intelligent code review and insights',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Get instant feedback on your code with real-time analysis',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Enterprise-grade security for your code repositories',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '📊',
      title: 'Detailed Reports',
      description: 'Comprehensive analytics and actionable recommendations',
      color: 'from-orange-500 to-red-500'
    }
  ]

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
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
              <Link href="/documentation" className="text-gray-300 hover:text-white transition">Docs</Link>
            </div>
            <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-semibold">
                🚀 Powered by IBM watsonx AI
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your Code
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                With AI Intelligence
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Automated code review and analysis that helps you write better code, faster. 
              Catch bugs, improve quality, and ship with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition">
                Start Free Trial
              </Link>
              <Link href="/documentation" className="px-8 py-4 bg-gray-800 text-white rounded-lg font-semibold border border-gray-700 hover:bg-gray-700 transition">
                Watch Demo
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {[
              { value: '10K+', label: 'Reviews Completed' },
              { value: '99.9%', label: 'Accuracy Rate' },
              { value: '50%', label: 'Time Saved' },
              { value: '24/7', label: 'AI Support' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div id="features" className="mb-20">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Powerful Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-gray-600 transition-all duration-300 cursor-pointer ${
                    hoveredFeature === index ? 'transform scale-105 shadow-2xl' : ''
                  }`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div id="about" className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Elevate Your Code Quality?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of developers using DevInsight AI
            </p>
            <Link href="/dashboard" className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition">
              Get Started Now →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2024 DevInsight AI. Powered by IBM watsonx AI.</p>
          <p className="mt-2 text-sm">Built for IBM Hackathon Project</p>
        </div>
      </footer>
    </div>
  )
}

// Made with Bob
