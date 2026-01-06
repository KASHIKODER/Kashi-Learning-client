export default function PolicyPage() {
  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-gray-600 dark:text-gray-300">
          <div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              enroll in a course, or contact us for support. This may include your name, email address, 
              and payment information.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To process your transactions</li>
              <li>To send you course updates and announcements</li>
              <li>To improve our platform and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the Internet is 100% secure, and we cannot 
              guarantee absolute security.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Third-Party Services
            </h2>
            <p>
              We may use third-party services for payment processing, analytics, and other functions. 
              These services have their own privacy policies governing the use of your information.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal information. 
              You can update your account information through your profile settings or contact us 
              for assistance.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <span className="font-medium">privacy@elearning.com</span>
            </p>
          </div>
          
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm">
              Last Updated: March 15, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}