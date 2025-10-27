# API Integration Notes

## Z.ai Chat
Endpoint: `${ZAI_BASE_URL}${ZAI_CHAT_PATH}` (default: https://api.z.ai + /api/paas/v4/chat/completions)  
Headers: `Authorization: Bearer ${ZAI_API_KEY}`, `Content-Type: application/json`  
Body:
```json
{ "model": "glm-4.6", "messages": [{"role":"user","content":"hi"}] }
```

## DeepInfra Images
OpenAI-compatible Images API: `https://api.deepinfra.com/v1/openai/images/generations`  
Headers: `Authorization: Bearer ${IMAGE_GEN_API_KEY}`, `Content-Type: application/json`  
Body:
```json
{ "model": "black-forest-labs/FLUX-1-dev", "prompt": "hero image...", "size": "1024x576" }
```
- Swap the model for others (e.g., SDXL) as needed.
