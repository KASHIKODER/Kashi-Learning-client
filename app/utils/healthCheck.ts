// File location: /utils/healthCheck.ts
export const wakeUpServer = async (): Promise<boolean> => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URI;
    if (!backendUrl) {
      console.error('❌ Backend URL not configured');
      return false;
    }
    
    console.log('🔍 Attempting to wake up server...');
    
    // Try to ping the backend with a short timeout first
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds max
    
    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok || response.status < 500) {
        console.log('✅ Server is awake and responding');
        return true;
      }
      
      console.log(`⚠️ Server responded with status: ${response.status}`);
      return false;
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.log('⚠️ Server might be sleeping or unreachable:', fetchError);
      return false;
    }
    
  } catch (error) {
    console.error('🔴 Error in wakeUpServer:', error);
    return false;
  }
};

// Alternative: Simple ping function
export const pingServer = async (): Promise<boolean> => {
  const backendUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  if (!backendUrl) return false;
  
  try {
    const response = await fetch(backendUrl, { 
      method: 'HEAD',
      cache: 'no-store'
    });
    return response.ok;
  } catch {
    return false;
  }
};