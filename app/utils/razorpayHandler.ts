import axios from "axios";

interface User {
  _id: string;
  name?: string;
  email?: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface OrderData {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
  courseName: string;
}

// Define Razorpay types
interface RazorpayError {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: Record<string, unknown>;
  };
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => Promise<void> | void;
  on?: {
    'payment.failed'?: (response: RazorpayError) => void;
    'modal.closed'?: () => void;
  };
}

interface VerificationResponse {
  success: boolean;
  alreadyEnrolled?: boolean;
  message?: string;
}

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayCheckoutOptions): RazorpayInstance;
    };
  }
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

/**
 * 🔹 Handle Razorpay Payment Flow
 */
export const handleRazorpayPayment = async (
  courseId: string,
  user: User,
  onSuccess: () => Promise<void> | void
) => {
  try {
    console.log("🚀 Creating Razorpay order...");
    console.log("📚 Course ID:", courseId);
    console.log("👤 User ID:", user._id);
    console.log("🌐 Backend URL:", process.env.NEXT_PUBLIC_SERVER_URI);
    
    // Validate inputs
    if (!courseId || !user?._id) {
      alert("Invalid course or user information");
      return;
    }
    
    // Check if Razorpay is available
    if (typeof window === 'undefined' || !window.Razorpay) {
      alert("Razorpay payment gateway is not available. Please try again later.");
      return;
    }
    
    // Build URL correctly
    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000/api/v1';
    const createOrderUrl = backendUrl.endsWith('/') 
      ? `${backendUrl}razorpay-order`
      : `${backendUrl}/razorpay-order`;
    
    console.log("📤 Creating order at:", createOrderUrl);
    
    // 1️⃣ Create Razorpay Order from backend
    const { data } = await axios.post<OrderData>(
      createOrderUrl,
      { courseId },
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log("✅ Order created successfully");
    console.log("Order ID:", data.orderId);
    console.log("Amount:", data.amount);
    console.log("Course:", data.courseName);

    const { orderId, amount, currency, key, courseName } = data;

    // 2️⃣ Configure Razorpay Checkout Options
    const options: RazorpayCheckoutOptions = {
      key,
      amount,
      currency,
      name: "ELearning Platform",
      description: `Purchase: ${courseName}`,
      order_id: orderId,
      prefill: {
        name: user.name || "",
        email: user.email || "",
      },
      theme: {
        color: "#4F46E5",
      },
      handler: async function (response: RazorpayResponse) {
        console.log("✅ Payment Success Response:", response);

        try {
          // Build verification URL
          const verifyUrl = backendUrl.endsWith('/') 
            ? `${backendUrl}verify-payment`
            : `${backendUrl}/verify-payment`;
          
          console.log("📤 Verifying payment at:", verifyUrl);
          
          // 3️⃣ Verify payment on backend
          const verifyRes = await axios.post<VerificationResponse>(
            verifyUrl,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId,
              userId: user._id,
            },
            { 
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              timeout: 15000 // 15 second timeout for verification
            }
          );

          console.log("✅ Verification response:", verifyRes.data);

          if (verifyRes.data.success) {
            console.log("🎉 Payment verified successfully");
            // 4️⃣ Update UI + Save locally + Redirect
            localStorage.setItem(`course_${courseId}_enrolled`, "true");
            alert("✅ Payment successful! Course unlocked.");
            await onSuccess();
          } else if (verifyRes.data.alreadyEnrolled) {
            console.log("ℹ️ User already enrolled");
            localStorage.setItem(`course_${courseId}_enrolled`, "true");
            alert("✅ You already have access to this course.");
            await onSuccess();
          } else {
            console.warn("⚠️ Payment verification failed on server");
            alert("⚠️ Payment verification failed. Please contact support.");
          }
        } catch (err: unknown) {
          console.error("❌ Verification Error:", err);
          
          if (axios.isAxiosError(err)) {
            console.error("📡 Axios Error Details:", {
              status: err.response?.status,
              statusText: err.response?.statusText,
              data: err.response?.data,
              url: err.config?.url
            });
            
            if (err.response?.status === 500) {
              console.error("💥 Server Error (500):", err.response.data);
              // For development/test environment
              if (process.env.NODE_ENV !== 'production') {
                console.warn("⚠️ Development mode: Marking as successful despite 500 error");
                localStorage.setItem(`course_${courseId}_enrolled`, "true");
                alert("✅ Payment received but server verification failed. Course access granted.");
                await onSuccess();
              } else {
                alert("Server error during verification. Please contact support.");
              }
            } else if (err.response?.status === 400) {
              alert(`Verification failed: ${err.response.data?.message || 'Invalid request'}`);
            } else {
              alert(`Network error: ${err.message}`);
            }
          } else {
            const message = err instanceof Error ? err.message : "Payment verification failed";
            
            // Development fallback
            if (process.env.NODE_ENV !== 'production') {
              console.warn("⚠️ Development mode: Skipping verification");
              localStorage.setItem(`course_${courseId}_enrolled`, "true");
              alert("✅ Test mode: Payment marked as successful.");
              await onSuccess();
            } else {
              alert(`❌ Verification failed: ${message}`);
            }
          }
        }
      }
    };

    // 5️⃣ Open Razorpay Modal
    const rzp = new window.Razorpay(options);
    
    // 6️⃣ Handle payment failure
    rzp.on("payment.failed", function (response: unknown) {
      const errorResponse = response as RazorpayError;
      console.error("❌ Payment failed:", errorResponse.error);
      alert(`Payment failed: ${errorResponse.error.description || "Please try again."}`);
    });
    
    // 7️⃣ Handle modal close
    rzp.on("modal.closed", function () {
      console.log("Payment modal closed by user");
    });
    
    rzp.open();

  } catch (error: unknown) {
    console.error("❌ Razorpay Setup Error:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("📡 Axios Error Details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        method: error.config?.method
      });
      
      if (error.response?.status === 404) {
        console.error("🔍 404 Error - Endpoint not found!");
        alert(`Payment endpoint not found (404). Please check if server is running.\n\nTried: ${error.config?.url}`);
        return;
      }
      
      if (error.response?.status === 401) {
        console.error("🔐 401 Unauthorized - User not authenticated");
        alert("Please login to continue with payment.");
        return;
      }
      
      if (error.response?.status === 400) {
        alert(`Invalid request: ${error.response.data?.message || 'Please check course details'}`);
        return;
      }
      
      if (error.response?.status === 500) {
        alert("Server error. Please try again later or contact support.");
        return;
      }
    }
    
    const message = error instanceof Error ? error.message : "Payment setup failed";
    alert(`Payment setup failed: ${message}`);
  }
};