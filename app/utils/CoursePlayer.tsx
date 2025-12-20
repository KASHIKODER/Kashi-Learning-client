import React, { FC, useState, useEffect } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

// Define types for the video data
interface VideoData {
  otp: string;
  playbackInfo: string;
  videoUrl: string;
}

interface VdoCipherResponse {
  success?: boolean;
  message?: string;
  data?: {
    otp: string;
    playbackInfo: string;
  };
  videoUrl?: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: VideoData | VdoCipherResponse | { videoUrl?: string };
  videoUrl?: string;
}

// Type guards without using 'any'
const isVideoData = (obj: unknown): obj is VideoData => {
  if (!obj || typeof obj !== 'object') return false;
  
  const typedObj = obj as Record<string, unknown>;
  return (
    'otp' in typedObj && 
    'playbackInfo' in typedObj &&
    typeof typedObj.otp === 'string' &&
    typeof typedObj.playbackInfo === 'string'
  );
};

const isVdoCipherResponse = (obj: unknown): obj is VdoCipherResponse => {
  if (!obj || typeof obj !== 'object') return false;
  
  const typedObj = obj as Record<string, unknown>;
  return 'data' in typedObj;
};

const hasVideoUrl = (obj: unknown): obj is { videoUrl: string } => {
  if (!obj || typeof obj !== 'object') return false;
  
  const typedObj = obj as Record<string, unknown>;
  return (
    'videoUrl' in typedObj && 
    typeof typedObj.videoUrl === 'string'
  );
};

type Props = { 
  videoUrl: string; 
  title: string 
};

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
  const [videoData, setVideoData] = useState<VideoData>({ 
    otp: '', 
    playbackInfo: '',
    videoUrl: '' 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!videoUrl) {
      console.log('❌ No video URL provided');
      setIsLoading(false);
      setError('No video URL provided');
      return;
    }

    console.log('🎥 Fetching video data for:', { videoUrl, title });

    const fetchVideoData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI || 'https://kashi-learning-server.onrender.com/api/v1';
        const apiUrl = `${baseUrl.replace(/\/$/, '')}/getVdoCipherOTP`;
        
        console.log('📡 Making API call to:', apiUrl);
        console.log('📦 Request data:', { videoId: videoUrl });
        
        const res: AxiosResponse<ApiResponse> = await axios.post(
          apiUrl,
          { videoId: videoUrl },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 15000
          }
        );

        console.log('✅ API Response status:', res.status);
        console.log('✅ API Response data:', res.data);

        const responseData = res.data;

        // Handle error response
        if (responseData?.success === false) {
          console.error('❌ Backend error:', responseData.message);
          setError(responseData.message || 'Backend error');
          return;
        }

        // Handle different response structures
        if (responseData?.data) {
          const responseDataObj = responseData.data;
          
          // Case 1: Direct VideoData
          if (isVideoData(responseDataObj)) {
            console.log('🎬 Direct VdoCipher video data received');
            setVideoData({
              otp: responseDataObj.otp,
              playbackInfo: responseDataObj.playbackInfo,
              videoUrl: ''
            });
            return;
          }
          
          // Case 2: VdoCipherResponse with nested data
          if (isVdoCipherResponse(responseDataObj) && responseDataObj.data) {
            // Check if nested data is VideoData
            const nestedData = responseDataObj.data as unknown;
            if (isVideoData(nestedData)) {
              console.log('🎬 Nested VdoCipher video data received');
              setVideoData({
                otp: nestedData.otp,
                playbackInfo: nestedData.playbackInfo,
                videoUrl: ''
              });
              return;
            }
          }
          
          // Case 3: Object with videoUrl
          if (hasVideoUrl(responseDataObj)) {
            console.log('🎬 Direct video URL received:', responseDataObj.videoUrl);
            setVideoData({
              otp: '',
              playbackInfo: '',
              videoUrl: responseDataObj.videoUrl
            });
            return;
          }
        }
        
        // Case 4: Direct videoUrl in response
        if (responseData?.videoUrl) {
          console.log('🎬 Direct video URL in response:', responseData.videoUrl);
          setVideoData({
            otp: '',
            playbackInfo: '',
            videoUrl: responseData.videoUrl
          });
          return;
        }
        
        // No valid data found
        console.error('❌ No video data in response:', responseData);
        setError('No video data available');
        
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        console.error('❌ Video fetch error details:');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error config URL:', error.config?.url);
        
        // Detailed error handling
        if (error.response) {
          switch (error.response.status) {
            case 404:
              setError(`API endpoint not found. Check if backend is running at: ${error.config?.url}`);
              break;
            case 401:
              setError('Authentication required. Please log in again.');
              break;
            case 403:
              setError('Access denied. You may not have permission.');
              break;
            case 500:
              setError('Server error. Please try again later.');
              break;
            default:
              setError(error.response.data?.message || `Error ${error.response.status}: Failed to load video`);
          }
        } else if (error.request) {
          setError('No response from server. Check if backend is running.');
        } else {
          setError(error.message || 'Failed to load video');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoData();
  }, [videoUrl, title]);

  // Extract YouTube video ID
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    
    // Handle youtu.be URLs
    if (url.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([^?&#]+)/);
      return match ? match[1] : null;
    }
    
    // Handle youtube.com URLs
    if (url.includes('youtube.com/watch')) {
      try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v');
      } catch {
        return null;
      }
    }
    
    return null;
  };

  // Render video player based on available data
  const renderVideoPlayer = () => {
    // Case 1: VdoCipher video
    if (videoData.otp && videoData.playbackInfo) {
      return (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=aHNZ2JVrJUCXazRF`}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
          allowFullScreen
          allow="encrypted-media"
          title={title}
        />
      );
    }
    
    // Case 2: Direct video URL
    if (videoData.videoUrl) {
      // YouTube URL
      const youtubeId = getYouTubeVideoId(videoData.videoUrl);
      if (youtubeId) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={title}
          />
        );
      }
      
      // Direct MP4/video file
      return (
        <video
          controls
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          src={videoData.videoUrl}
          title={title}
        >
          Your browser does not support the video tag.
        </video>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl">
      <div className="relative w-full" style={{ position: "relative", paddingTop: '56.25%', overflow: "hidden" }}>
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/80">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium">Loading video...</p>
            <p className="text-sm text-gray-400 mt-1">{title}</p>
            <p className="text-xs text-gray-500 mt-2">Calling: {process.env.NEXT_PUBLIC_SERVER_URI}getVdoCipherOTP</p>
          </div>
        ) : videoData.otp || videoData.videoUrl ? (
          renderVideoPlayer()
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/80">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">!</span>
            </div>
            <p className="text-lg font-medium">Video unavailable</p>
            <p className="text-sm text-gray-400 mt-1">{error || 'Please try again later'}</p>
            <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-900 rounded">
              Endpoint: {process.env.NEXT_PUBLIC_SERVER_URI}getVdoCipherOTP
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;