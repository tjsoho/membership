import { getAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CreateCourseForm } from '@/components/admin/CreateCourseForm'
import { CoursesList } from '@/components/admin/CoursesList'
import { Navbar } from '@/components/Navbar'

export default async function AdminCoursesPage() {
  const session = await getAuthSession()
  
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-coastal-shell py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-coastal-sand">
            <div className="flex items-center space-x-3 text-coastal-ocean mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h1 className="text-3xl font-bold">Unauthorized Access</h1>
            </div>
            <div className="space-y-3 text-coastal-ocean/80">
              <p>Current email: <span className="font-mono bg-coastal-sand px-3 py-1 rounded-lg">{session?.user?.email || 'Not logged in'}</span></p>
              <p>Required admin email: <span className="font-mono bg-coastal-sand px-3 py-1 rounded-lg">{process.env.ADMIN_EMAIL}</span></p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-coastal-shell">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-coastal-sand">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-coastal-ocean">Course Management</h1>
              <p className="text-coastal-ocean/60 mt-2">Manage your course catalog</p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-coastal-teal rounded-full animate-pulse"></div>
              <span className="text-coastal-ocean/60">
                Logged in as {session.user.email}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid gap-8">
          <div className="bg-white rounded-2xl shadow-lg border border-coastal-sand overflow-hidden">
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-coastal-tealLight/10 p-3 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-coastal-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-coastal-ocean">Add New Course</h2>
              </div>
              <CreateCourseForm />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-coastal-sand overflow-hidden">
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-coastal-oceanLight/10 p-3 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-coastal-ocean" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-coastal-ocean">Existing Courses</h2>
              </div>
              <CoursesList />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 