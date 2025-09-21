import axios from "axios";
const API_URL = "https://ai-resumeanalyzer-backend.onrender.com"


export async function fetchWithAuth(url, method = 'GET', data = null) {
  try {
    let token = localStorage.getItem('accessToken');
    console.log('🔐 Using token from localStorage:', token);

    const config = {
      method,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      ...(data && { data }),
    };

    console.log('📡 Sending request to:', url);

    // Attempt main API call
    let response;
    try {
      response = await axios(config);
      console.log('✅ API success:', response.data);
      return response;
    } catch (error) {
      console.error('🚨 Error during axios call:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
      });

      // If token is expired (401), try refresh
      if (error.response?.status === 401) {
        console.warn('🔄 Token expired. Trying to refresh...');

        try {
          const refreshResponse = await axios.get(`${API_URL}/api/auth/refresh`, {
            withCredentials: true,
          });

          const newAccessToken = refreshResponse.data.accessToken;
          console.log('✅ Got new token:', newAccessToken);

          localStorage.setItem('accessToken', newAccessToken);
          console.log('💾 Stored new token in localStorage');

          // Retry original request with new token
          const retryConfig = {
            ...config,
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          };

          const retryResponse = await axios(retryConfig);
          console.log('🔁 Retried request success:', retryResponse.data);
          return retryResponse;
        } catch (refreshErr) {
          console.error('❌ Refresh token failed:', {
            message: refreshErr.message,
            code: refreshErr.code,
            status: refreshErr.response?.status,
            data: refreshErr.response?.data,
          });

          localStorage.removeItem('accessToken');
          // window.location.href = '/land';
          throw refreshErr;
        }
      } else {
        // Other errors (not 401)
        throw error;
      }
    }
  } catch (finalErr) {
    console.error('❌ Final fetchWithAuth error:', finalErr);
    throw finalErr;
  }
}
