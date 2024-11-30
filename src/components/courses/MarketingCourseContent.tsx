export function MarketingCourseContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">3600000 degree Easy Marketing Plan</h1>
      
      <div className="space-y-8">
        {/* Introduction Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Welcome to Your Marketing Journey</h2>
          <p className="text-gray-600">
            Get ready to transform your marketing strategy with our comprehensive guide.
          </p>
        </section>

        {/* Content Section */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Module 1: Getting Started</h3>
          <div className="prose max-w-none">
            <h4 className="text-lg font-medium">Key Points:</h4>
            <ul className="list-disc pl-5">
              <li>Understanding your target audience</li>
              <li>Setting clear marketing objectives</li>
              <li>Creating your unique value proposition</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
} 