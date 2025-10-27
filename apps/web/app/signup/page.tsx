export default function SignupPage() {
  return (
    <main className="min-h-dvh p-6 flex items-center justify-center">
      <div className="max-w-md w-full glass p-8 rounded-2xl space-y-6">
        <div className="text-center space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="glyphd" className="h-10 mx-auto" />
          <h1 className="text-2xl font-semibold">Sign Up</h1>
          <p className="text-sm text-neutral-400">Create your Glyphd account</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400 block mb-2">Email</label>
            <input type="email" className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none" placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-sm text-neutral-400 block mb-2">Password</label>
            <input type="password" className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none" placeholder="••••••••" />
          </div>
          <button className="w-full btn-primary py-3">Sign Up</button>
        </div>
        
        <div className="text-center text-sm text-neutral-400">
          <a href="/login" className="hover:text-white">Already have an account? Log in</a>
        </div>
        
        <div className="text-center">
          <a href="/" className="text-sm text-neutral-500 hover:text-neutral-400">← Back to home</a>
        </div>
      </div>
    </main>
  )
}

