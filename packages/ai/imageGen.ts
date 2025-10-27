// Image generation using DeepInfra's OpenAI-compatible Images API
// Docs: https://deepinfra.com/docs/advanced/lora_text_to_image
export async function generateImage(apiKey: string, prompt: string, size='1024x576', model='black-forest-labs/FLUX-1-dev') {
  if (!apiKey) {
    throw new Error('IMAGE_GEN_API_KEY is not set. Please configure it in /settings/keys')
  }
  
  const url = 'https://api.deepinfra.com/v1/openai/images/generations'
  
  // Create abort controller with 25 second timeout (Vercel free tier is 30s)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 25000)
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model, prompt, size }),
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
          errorText = text.substring(0, 100) // Limit error text length
        }
      } catch (e) {
        // Use status text as fallback
        errorText = res.statusText
      }
      throw new Error(`Image generation failed (${res.status}): ${errorText}`)
    }
    
    return res.json()
  } catch (err: any) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new Error('Image generation timed out after 25 seconds')
    }
    throw new Error(`Image API request failed: ${err.message}`)
  }
}
