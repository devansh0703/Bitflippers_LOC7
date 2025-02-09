import React from 'react';
import {
  Truck,
  BarChart3,
  Clock,
  Shield,
  MapPin,
  ArrowRight,
  Package,
  Zap,
  CheckCircle,
} from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export function LandingPage({ onEnterDashboard }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="Logistics Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black"></div>
        </div>

        <nav className="relative z-10 border-b border-red-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Truck className="w-8 h-8 text-red-500" />
                <span className="text-2xl font-bold text-red-500">SwiftShip</span>
              </div>
              <button
                onClick={onEnterDashboard}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-800 text-transparent bg-clip-text">
              Next-Gen Logistics Management
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Transform your delivery operations with AI-powered route
              optimization, real-time tracking, and smart analytics.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={onEnterDashboard}
                className="px-8 py-3 text-lg font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#features"
                className="px-8 py-3 text-lg font-medium text-red-500 border border-red-500 rounded-md hover:bg-red-500/10 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-neutral-900 border-y border-red-800/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-red-500 mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your logistics operations efficiently
              and scale your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg bg-black border border-red-800/30 hover:border-red-500/50 transition-colors"
              >
                <feature.icon className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-lg bg-neutral-900 border border-red-800/30"
              >
                <div className="text-3xl font-bold text-red-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900 border-y border-red-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-4">
            Ready to Transform Your Logistics?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust SwiftShip for their delivery
            operations.
          </p>
          <button
            onClick={onEnterDashboard}
            className="px-8 py-3 text-lg font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors inline-flex items-center gap-2"
          >
            Start Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-6 h-6 text-red-500" />
              <span className="text-xl font-bold text-red-500">SwiftShip</span>
            </div>
            <div className="text-sm">
              © 2024 SwiftShip. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    description:
      'Track your deliveries in real-time with precise GPS location and status updates.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Gain insights into your operations with comprehensive analytics and reporting.',
  },
  {
    icon: Clock,
    title: 'Smart Scheduling',
    description:
      'Optimize delivery routes and schedules with AI-powered algorithms.',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description:
      'Enterprise-grade security to protect your data and customer information.',
  },
  {
    icon: Package,
    title: 'Order Management',
    description:
      'Streamline your order processing with our intuitive management system.',
  },
  {
    icon: Zap,
    title: 'Fast Performance',
    description:
      'Lightning-fast operations with real-time updates and minimal latency.',
  },
];

const stats = [
  {
    value: '99.9%',
    label: 'Delivery Success Rate',
  },
  {
    value: '30%',
    label: 'Cost Reduction',
  },
  {
    value: '24/7',
    label: 'Customer Support',
  },
  {
    value: '50K+',
    label: 'Daily Deliveries',
  },
];