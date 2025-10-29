# API Integration Notes

## z.ai GLM Coding Plan Chat
Endpoint: `${ZAI_BASE_URL}${ZAI_CHAT_PATH}` (default: https://api.z.ai/api/coding/paas/v4 + /chat/completions)  
Headers: `Authorization: Bearer ${ZAI_API_KEY}`, `Content-Type: application/json`  
Body:
```json
{ "model": "GLM-4.6", "messages": [{"role":"user","content":"hi"}] }
```
Note: Available models are `GLM-4.6`, `GLM-4.5`, and `GLM-4.5-air`.

## DeepInfra Images
OpenAI-compatible Images API: `https://api.deepinfra.com/v1/openai/images/generations`  
Docs: https://deepinfra.com/docs/getting-started  
Headers: `Authorization: Bearer ${IMAGE_GEN_API_KEY}`, `Content-Type: application/json`  
Body:
```json
{ 
  "model": "black-forest-labs/FLUX-1-dev", 
  "prompt": "hero image...", 
  "width": 1024,
  "height": 576,
  "n": 1,
  "response_format": "b64_json"
}
```
- Model: `black-forest-labs/FLUX-1-dev` (FLUX-1-dev from Black Forest Labs)
- `width` and `height` are integers (not a size string)
- `response_format` can be `b64_json` (base64) or `url` (external URL)
- Supports sizes from 128x128 to 1920x1920 pixels
