import { useState, useEffect } from 'react'
import { Globe, Code, Camera, BarChart3, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage({ onPageChange }) {
  const [siteContent, setSiteContent] = useState({})
  const [stats, setStats] = useState({
    totalScraped: 0,
    totalComponents: 0,
    recentActivity: []
  })

  useEffect(() => {
    // Fetch site content
    fetch('/api/site-content/home')
      .then(res => res.json())
      .then(data => {
        const content = {}
        data.forEach(item => {
          content[item.section_id] = item.content
        })
        setSiteContent(content)
      })
      .catch(err => console.error('Error fetching site content:', err))

    // Fetch basic stats
    fetch('/api/scraped-data?per_page=1')
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({
          ...prev,
          totalScraped: data.total || 0
        }))
      })
      .catch(err => console.error('Error fetching stats:', err))
  }, [])

  const features = [
    {
      icon: Globe,
      title: 'Web Scraping',
      description: 'Automatically scrape websites and capture screenshots of web pages.'
    },
    {
      icon: Code,
      title: 'Component Analysis',
      description: 'Extract and analyze data-component attributes from web elements.'
    },
    {
      icon: Camera,
      title: 'Visual Capture',
      description: 'Take high-quality screenshots of scraped pages for visual reference.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'View detailed analytics and insights about your scraped data.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative bg-blue-600 p-4 rounded-full">
                  <Globe className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            
            <div 
              className="mb-6"
              dangerouslySetInnerHTML={{ 
                __html: siteContent.hero || '<h1 class="text-5xl font-bold text-gray-900 mb-4">Welcome to Source Code Scraper</h1><p class="text-xl text-gray-600">Discover and analyze web components from various websites.</p>'
              }}
            />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                size="lg" 
                onClick={() => onPageChange('browse')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                Browse Scraped Data
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => onPageChange('admin')}
                className="px-8 py-3 text-lg"
              >
                Admin Panel
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalScraped}
            </div>
            <div className="text-gray-600">Pages Scraped</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.totalComponents}
            </div>
            <div className="text-gray-600">Components Found</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center border">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              24/7
            </div>
            <div className="text-gray-600">Monitoring</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to scrape, analyze, and manage web component data
          </p>
        </div>

        <div 
          className="mb-12"
          dangerouslySetInnerHTML={{ 
            __html: siteContent.features || ''
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Scraping?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust our platform for web component analysis
            </p>
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => onPageChange('browse')}
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

