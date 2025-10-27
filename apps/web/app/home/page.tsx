export default function Home() {
  return (
    <main className="min-h-dvh p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="glyphd" className="h-8" />
          <h1 className="text-3xl font-semibold">glyphd</h1>
        </div>
        <p className="text-neutral-400 max-w-2xl">
          <span className="brand-grad font-semibold">Make your mark.</span> Turn ideas into <b>Symbols</b>—
          fully-formed mini apps—using Z.ai + image generation.
        </p>
        <a href="/" className="inline-block btn-primary">Start your first Symbol</a>
      </div>
    </main>
  )
}
