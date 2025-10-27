# Agents Definition – z.ai Studio

## BuilderPromptAgent
Interprets user instructions and emits a `spec.json` (UI layout, pages, components), image prompts, and a list of code tasks.

## AssetGenAgent
Generates image assets via DeepInfra or other engines. Returns file paths and suggested insertion points into the layout.

## CodeGenAgent
Invokes LLMs (default: Z.ai GLM-4.5/4.6 families) to generate UI components, services, and glue code according to `spec.json`.

## DeployAgent
Packages apps for local desktop (Go/Fyne) or web (Next.js) and triggers deployment (local tunnel or Vercel/Puter).

## Workflow
1. Chat → BuilderPromptAgent
2. BuilderPromptAgent → `spec.json`, image prompts, tasks
3. AssetGenAgent → images
4. CodeGenAgent → code scaffold
5. DeployAgent → build/deploy
