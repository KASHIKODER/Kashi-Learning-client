// PolicyPage.tsx
export default function PolicyPage() {
  return (
    <div className="min-h-screen pt-24 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your privacy is our priority. Learn how we protect and manage your data.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {[
            {
              title: "Information We Collect",
              content: "We collect information you provide directly to us, such as when you create an account, enroll in a course, or contact us for support. This may include your name, email address, payment information, and learning preferences.",
              icon: "📊"
            },
            {
              title: "How We Use Your Information",
              points: [
                "To provide and maintain our educational services",
                "To process your transactions securely",
                "To personalize your learning experience",
                "To send you course updates and announcements",
                "To improve our platform through analytics",
                "To comply with legal obligations"
              ],
              icon: "🔍"
            },
            {
              title: "Data Security",
              content: "We implement enterprise-grade security measures including encryption, secure servers, and regular security audits to protect your personal information. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.",
              icon: "🔒"
            },
            {
              title: "Third-Party Services",
              content: "We partner with trusted third-party services for payment processing, analytics, and infrastructure. These services adhere to strict privacy standards and have their own privacy policies governing data usage.",
              icon: "🤝"
            },
            {
              title: "Your Rights",
              content: "You have full control over your data including rights to access, correct, export, or delete your personal information. Manage your preferences through your profile settings or contact our privacy team for assistance.",
              icon: "⚖️"
            },
            {
              title: "Contact Us",
              content: "For privacy-related inquiries, our dedicated team is here to help.",
              contact: "privacy@elearning.com",
              icon: "📧"
            }
          ].map((section, index) => (
            <div 
              key={index} 
              className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{section.icon}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {section.title}
                  </h2>
                  
                  {section.content && (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {section.content}
                    </p>
                  )}
                  
                  {section.points && (
                    <ul className="space-y-3">
                      {section.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {section.contact && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 rounded-lg">
                      <p className="font-medium text-blue-600 dark:text-blue-400">
                        {section.contact}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Last Updated */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Policy Transparency</h3>
              <p className="text-gray-600 dark:text-gray-300">We regularly update our policies to ensure transparency</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="px-6 py-3 bg-white dark:bg-gray-700 rounded-full shadow-md">
                <p className="font-medium text-gray-900 dark:text-white">
                  Last Updated: <span className="text-blue-600 dark:text-blue-400">March 15, 2024</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}