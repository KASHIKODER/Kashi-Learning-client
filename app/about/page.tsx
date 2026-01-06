export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          About ELearning
        </h1>
        
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <p>
            Welcome to ELearning, your premier destination for online education and skill development. 
            Our mission is to make quality education accessible to everyone, everywhere.
          </p>
          
          <p>
            Founded with the vision of transforming traditional learning, we offer a wide range of 
            courses designed by industry experts to help you advance your career and personal growth.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
            Our Mission
          </h2>
          <p>
            To democratize education by providing affordable, high-quality learning resources 
            that empower individuals to achieve their personal and professional goals.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
            Our Values
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Quality Education for All</li>
            <li>Innovative Learning Methods</li>
            <li>Student Success Focus</li>
            <li>Continuous Improvement</li>
            <li>Community Building</li>
          </ul>
          
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="font-medium">
              Join thousands of successful learners who have transformed their careers with our courses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}