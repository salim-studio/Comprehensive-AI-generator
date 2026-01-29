export default {
    // API endpoints
    apis: {
        image: {
            baseUrl: "https://image.pollinations.ai/prompt/",
            modelsUrl: "https://image.pollinations.ai/models",
            feedUrl: "https://image.pollinations.ai/feed"
        },
        text: {
            baseUrl: "https://text.pollinations.ai/",
            modelsUrl: "https://text.pollinations.ai/models",
            feedUrl: "https://text.pollinations.ai/feed",
            openaiUrl: "https://text.pollinations.ai/openai"
        }
    },
    
    // Default settings for image generation
    imageDefaults: {
        style: "realistic",
        quality: "standard",
        aspectRatio: "1:1",
        autoEnhance: true
    },
    
    // Default settings for text generation
    textDefaults: {
        type: "article",
        length: "medium",
        style: "formal"
    },
    
    // Default settings for audio generation
    audioDefaults: {
        voice: "alloy",
        speed: 1.0,
        quality: "standard"
    },
    
    // UI Configurations
    ui: {
        gallerySize: 6,
        darkModeDefault: false,
        language: "ar"
    },
    
    // Styles mappings for image generation
    imageStyles: {
        "realistic": "",
        "artistic": "artistic painting, detailed, trending on artstation",
        "sci-fi": "sci-fi concept art, futuristic, detailed, trending on artstation",
        "futuristic": "futuristic rendering, highly detailed, 8k",
        "anime": "anime style, vibrant colors, detailed illustration",
        "cartoon": "cartoon style, colorful, cute character design"
    },
    
    // Quality mappings for image generation
    imageQualities: {
        "standard": "",
        "hd": "high quality, 4k, detailed",
        "4k": "ultra high quality, 8k, extremely detailed, professional photo"
    }
};

