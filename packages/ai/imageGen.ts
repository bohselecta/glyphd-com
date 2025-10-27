// Image generation using DeepInfra OpenAI-compatible Images API
// Docs: https://deepinfra.com/docs/advanced/lora_text_to_image
export async function generateImage(apiKey: string, prompt: string, size='1024x576', model='black-forest-labs/FLUX-1-dev') {
  if (!apiKey) {
    throw new Error('IMAGE_GEN_API_KEY is not set. Please configure it in /settings/keys')
  }
  
  const url = 'https://api.deepinfra.com/v1/openai/images/generations'
  
  // Create abort controller with 60 second timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000)
  
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
      const error = await res.json().catch(() => ({ error: { message: `HTTP ${res.status}` } }))
      throw new Error(`Image generation failed: ${error.error?.message || res.statusText}`)
    }
    
    return res.json()
  } catch (err: any) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new Error('Image generation timed out after 60 seconds')
    }
    throw new Error(`Image API request failed: ${err.message}`)
  }
}
