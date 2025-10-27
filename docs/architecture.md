# Architecture

```
Prompt → Intent Parser (core) → Composer (core) →
  [ai/zaiClient → LLM]
  [ai/imageGen → Image API]
→ Inserter (core) → Packager (deployer) → Deployer (deployer)
```
