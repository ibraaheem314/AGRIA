// src/lib/api/config.ts

export const config = {
    // OpenAI / OpenRouter / HuggingFace
    openRouter: {
      apiKey: import.meta.env.VITE_OPEN_ROUTER_KEY || '',
      baseUrl: 'https://openrouter.ai/api/v1',
    },
    huggingface: {
      tokens: [
        import.meta.env.VITE_HUGGING_FACE_TOKEN_1 || '',
        import.meta.env.VITE_HUGGING_FACE_TOKEN_2 || '',
        import.meta.env.VITE_HUGGING_FACE_TOKEN_3 || '',
      ],
      baseUrl: 'https://api-inference.huggingface.co/models',
    },
  
    // Weather APIs
    weather: {
      openWeather: {
        apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || '1707374d07315cd524c6e04d0b0b734b',
        baseUrl: 'https://api.openweathermap.org/data/2.5',
      },
      airVisual: {
        apiKey: import.meta.env.VITE_AIRVISUAL_API_KEY || '',
        baseUrl: 'https://api.airvisual.com/v2',
      },
    },
    
    // Climate API
    climate: {
      apiKey: import.meta.env.VITE_AGROMONITORING_API_KEY || 'a208b345ce27b388f58bbb2a32b73dbd',
      baseUrl: 'https://api.agromonitoring.com/agro/1.0',
    },
  
    // Database
    database: {
      url: import.meta.env.VITE_DATABASE_URL || '',
    },
  
    // Email (SMTP)
    email: {
      user: import.meta.env.VITE_EMAIL_USER || '',
      pass: import.meta.env.VITE_EMAIL_PASS || '',
    },
  
    // Twilio (SMS notifications)
    twilio: {
      accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
      authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
      phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || '',
    },
  };
  