import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Database, 
  FileText, 
  Users, 
  Settings, 
  Globe, 
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function AdminPanel({ adminUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [analytics, setAnalytics] = useState({})
  const [scrapedData, setScrapedData] = useState([])
  const [siteContent, setSiteContent] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchAnalytics()
    } else if (activeTab === 'scraped-data') {
      fetchScrapedData()
    } else if (activeTab === 'site-content') {
      fetchSiteContent()
    } else if (activeTab === 'users') {
      fetchAdminUsers()
    }
  }, [activeTab])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/analytics', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchScrapedData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/scraped-data?per_page=20', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setScrapedData(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching scraped data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSiteContent = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/site-content', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setSiteContent(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching site content:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAdminUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setAdminUsers(data || [])
      }
    } catch (error) {
      console.error('Error fetching admin users:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteScrapedData = async (id) => {
    if (!confirm('Are you sure you want to delete this scraped data?')) return
    
    try {
      const response = await fetch(`/api/scraped-data/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.ok) {
        fetchScrapedData()
      }
    } catch (error) {
      console.error('Error deleting scraped data:', error)
    }
  }

  const toggleContentPublish = async (id, isPublished) => {
    try {
      const endpoint = isPublished ? 'unpublish' : 'publish'
      const response = await fetch(`/api/admin/site-content/${id}/${endpoint}`, {
        method: 'POST',
        credentials: 'include'
      })
      if (response.ok) {
        fetchSiteContent()
      }
    } catch (error) {
      console.error('Error toggling content publish status:', error)
    }
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'scraped-data', name: 'Scraped Data', icon: Database },
    { id: 'site-content', name: 'Site Content', icon: FileText },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'scraper', name: 'Scraper', icon: Globe }
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Admin Panel
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {adminUser.username}
              </span>
              <Button
                variant="outline"
                onClick={onLogout}
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm border p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {tab.name}
                    </button>
                  )
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && !loading && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <Database className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Scraped Data</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.totals?.scraped_data || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Site Content</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.totals?.site_content || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <Eye className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Published</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.totals?.published_content || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Admin Users</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics.totals?.admin_users || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Scraped Data
                    </h3>
                    <div className="space-y-3">
                      {analytics.recent_activity?.scraped_data?.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.url}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(item.timestamp)}
                            </p>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {item.components?.length || 0} components
                          </span>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-sm">No recent activity</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Content Updates
                    </h3>
                    <div className="space-y-3">
                      {analytics.recent_activity?.site_content?.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {item.page_name}.{item.section_id}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(item.last_updated)}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.is_published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-sm">No recent updates</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scraped Data Tab */}
            {activeTab === 'scraped-data' && !loading && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">Scraped Data Management</h1>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              URL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Components
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {scrapedData.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                  {item.url}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-600">
                                  {item.components?.length || 0}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(item.timestamp)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteScrapedData(item.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Site Content Tab */}
            {activeTab === 'site-content' && !loading && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">Site Content Management</h1>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Page
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Section
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Last Updated
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {siteContent.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.page_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.section_id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  item.is_published 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.is_published ? 'Published' : 'Draft'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(item.last_updated)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleContentPublish(item.id, item.is_published)}
                                >
                                  {item.is_published ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && !loading && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Username
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Last Login
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {adminUsers.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {user.username}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.role}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.is_active 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {user.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.last_login ? formatDate(user.last_login) : 'Never'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scraper Tab */}
            {activeTab === 'scraper' && !loading && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Web Scraper</h1>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Scraper functionality will be implemented in the testing phase
                  </h3>
                  <p className="text-gray-600">
                    This section will allow you to configure and run web scraping operations.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

