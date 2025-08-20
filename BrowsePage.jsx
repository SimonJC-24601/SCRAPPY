import { useState, useEffect } from 'react'
import { Search, ExternalLink, Calendar, Code, Image, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BrowsePage() {
  const [scrapedData, setScrapedData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    fetchScrapedData()
  }, [currentPage, searchQuery])

  const fetchScrapedData = async () => {
    setLoading(true)
    try {
      const url = searchQuery 
        ? `/api/scraped-data/search?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&per_page=12`
        : `/api/scraped-data?page=${currentPage}&per_page=12`
      
      const response = await fetch(url)
      const data = await response.json()
      
      setScrapedData(data.data || [])
      setTotalPages(data.pages || 1)
    } catch (error) {
      console.error('Error fetching scraped data:', error)
      setScrapedData([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchScrapedData()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateUrl = (url, maxLength = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Scraped Data
          </h1>
          <p className="text-gray-600">
            Explore and analyze web components from scraped websites
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by URL or component name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            {searchQuery && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setCurrentPage(1)
                }}
              >
                Clear
              </Button>
            )}
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Data Grid */}
        {!loading && (
          <>
            {scrapedData.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No data found
                </h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Try adjusting your search terms' : 'No scraped data available yet'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {scrapedData.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-2">
                            {truncateUrl(item.url)}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(item.timestamp)}
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>

                      {item.components && item.components.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Code className="h-4 w-4 mr-1" />
                            Components ({item.components.length})
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.components.slice(0, 3).map((component, index) => (
                              <span 
                                key={index}
                                className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                              >
                                {component}
                              </span>
                            ))}
                            {item.components.length > 3 && (
                              <span className="inline-block bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded">
                                +{item.components.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {item.screenshot_path && (
                        <div className="flex items-center text-sm text-green-600">
                          <Image className="h-4 w-4 mr-1" />
                          Screenshot available
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Scraped Data Details
                    </h2>
                    <p className="text-gray-600 break-all">
                      {selectedItem.url}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Components ({selectedItem.components?.length || 0})
                    </h3>
                    {selectedItem.components && selectedItem.components.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {selectedItem.components.map((component, index) => (
                          <div 
                            key={index}
                            className="bg-gray-50 p-3 rounded border text-sm font-mono"
                          >
                            {component}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No components found</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Screenshot
                    </h3>
                    {selectedItem.screenshot_path ? (
                      <img 
                        src={`/${selectedItem.screenshot_path}`}
                        alt="Website screenshot"
                        className="w-full border rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'block'
                        }}
                      />
                    ) : (
                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No screenshot available</p>
                      </div>
                    )}
                    <div style={{display: 'none'}} className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Screenshot not found</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Scraped on: {formatDate(selectedItem.timestamp)}</span>
                    <a 
                      href={selectedItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Visit Original Site
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

