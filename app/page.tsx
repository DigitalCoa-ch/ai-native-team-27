export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,107,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,0,0.06)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]" />

      {/* Radial glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(255,107,0,0.12)_0%,transparent_70%)]"/>

      {/* Orange accent lines */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6b00] to-transparent opacity-40"/>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6b00] to-transparent opacity-40"/>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Label */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#ff6b00]/30 bg-[#ff6b00]/10 px-4 py-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff6b00]"/>
          <span className="font-mono text-xs tracking-widest text-[#ff6b00] uppercase">AI Native Enterprise Lab · Team 27</span>
        </div>

        {/* Main heading */}
        <h1 className="font-mono text-5xl md:text-7xl font-bold tracking-tight text-white">
          Hello World
        </h1>
        <p className="mt-2 font-mono text-2xl md:text-3xl text-[#ff6b00]">
          Lukas, Ella &amp; Sander
        </p>

        {/* Separator */}
        <div className="mx-auto mt-10 h-px w-48 bg-gradient-to-r from-transparent via-[#ff6b00]/50 to-transparent"/>

        {/* Sub info */}
        <p className="mt-8 text-sm text-white/40 font-mono tracking-wide">
          Sentinel Risk · Command Center Interface
        </p>
      </div>

      {/* Bottom corner badge */}
      <div className="absolute bottom-8 right-8 font-mono text-xs text-white/20">
        SENTINEL RISK v2.4.1
      </div>
    </main>
  );
}