import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section class="space-y-6">
      <div class="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-semibold tracking-tight">Proyecto base listo ✅</h1>
        <p class="mt-2 text-sm text-slate-600">
          Tailwind ya está configurado. Edita este componente para empezar.
        </p>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl border p-4">
            <div class="text-sm font-semibold">Comandos</div>
            <ul class="mt-2 list-disc pl-5 text-sm text-slate-600">
              <li><code class="font-mono">npm install</code></li>
              <li><code class="font-mono">npm start</code></li>
              <li><code class="font-mono">npm run build</code></li>
            </ul>
          </div>

          <div class="rounded-xl border p-4">
            <div class="text-sm font-semibold">Estructura</div>
            <ul class="mt-2 list-disc pl-5 text-sm text-slate-600">
              <li><code class="font-mono">src/app/app.routes.ts</code></li>
              <li><code class="font-mono">src/app/pages/home</code></li>
              <li><code class="font-mono">tailwind.config.js</code></li>
              <li><code class="font-mono">postcss.config.js</code></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {}
