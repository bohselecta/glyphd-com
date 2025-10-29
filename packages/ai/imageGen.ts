// Image generation using DeepInfra's OpenAI-compatible Images API
// Docs: https://deepinfra.com/docs/getting-started
// Model: black-forest-labs/FLUX-1-dev
export async function generateImage(apiKey: string, prompt: string, size='1024x576', model='black-forest-labs/FLUX-1-dev') {
  if (!apiKey) {
    throw new Error('IMAGE_GEN_API_KEY is not set. Please configure it in /settings/keys (DeepInfra API key)')
  }
  
  const url = 'https://api.deepinfra.com/v1/openai/images/generations'
  
  // Parse size string (e.g., "1024x576") into width and height
  const [width, height] = size.split('x').map(Number)
  if (!width || !height || isNaN(width) || isNaN(height)) {
    throw new Error(`Invalid size format: ${size}. Expected format: "WIDTHxHEIGHT" (e.g., "1024x576")`)
  }
  
  // Create abort controller with 60 second timeout (FLUX can take longer)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000)
  
  try {
    // Use OpenAI-compatible format with width/height as integers
    const body = {
      model,
      prompt,
      width,
      height,
      n: 1, // Number of images to generate
      response_format: 'b64_json' // Request base64 format for easier handling
    }
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!res.ok) {
      // Try to get error details
      let errorText = `HTTP ${res.status}`
      try {
        const contentType = res.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          const error = await res.json()
          errorText = error.error?.message || error.message || JSON.stringify(error)
        } else {
          const text = await res.text()
          errorText = text.substring(0, 200) // Limit error text length
        }
      } catch (e) {
        // Use status text as fallback
        errorText = res.statusText
      }
      throw new Error(`DeepInfra image generation failed (${res.status}): ${errorText}`)
    }
    
    const data = await res.json()
    
    // Ensure response format matches expected structure
    // DeepInfra returns OpenAI-compatible format: { data: [{ b64_json: "...", url: "..." }] }
    return data
  } catch (err: any) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new Error('Image generation timed out after 60 seconds')
    }
    throw new Error(`DeepInfra API request failed: ${err.message}`)
  }
}
