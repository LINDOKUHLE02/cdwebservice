# 🤖 VS Code Copilot Prompt — 3D Cyberpunk Upgrade for Crafted Digital

> Copy and paste the entire prompt below into GitHub Copilot Chat in VS Code.

---

## PROMPT (Copy Everything Below This Line)

---

I have an existing IT services agency website called **Crafted Digital** built with plain HTML, CSS, and vanilla JavaScript (3 files: `index.html`, `style.css`, `script.js`). I want you to upgrade it into a **3D cyberpunk dark theme website** with animated robots. Here is exactly what I need:

---

### 🎨 DESIGN THEME — Cyberpunk Dark

Keep all the existing content and page sections exactly as they are (same text, same nav links, same form fields, same footer). Only upgrade the visual design and add 3D elements. Use these existing brand colors and extend them:

- Background: `#0a0f18` (deep dark navy)
- Primary brand: `#ff7a18` (neon orange)
- Secondary accent: `#0f58a8` (electric blue)
- Text: `#edf2f8`
- Muted text: `#b2bfd3`
- New additions: add `#00f5ff` (cyan neon) and `#7b2ff7` (neon purple) as accent glows

Fonts already in use: `Manrope` and `Sora` (keep these).

Add these cyberpunk visual elements to the existing CSS:
- Glowing neon borders on cards (cyan or orange box-shadow glow on hover)
- A scanline overlay effect on the hero section (CSS pseudo-element with repeating horizontal lines at low opacity)
- Neon text glow on all `<h1>` and `<h2>` headings using `text-shadow`
- Animated gradient borders on `.package-card.featured` using `@keyframes`
- A subtle grid/circuit-board pattern as a background texture on `body` using CSS `background-image` with SVG inline or CSS gradients
- Replace the plain `.bg-orb` blobs with more dramatic neon glow orbs (larger blur radius, brighter neon colors)
- All `.card` and `.package-card` elements should have a glassmorphism look: `background: rgba(19, 27, 40, 0.7)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(0, 245, 255, 0.15)`

---

### 🤖 3D ROBOT ANIMATION — Hero Section

In the hero section, **replace the existing `<img src="robotics-automation.svg">` element** with a Three.js 3D animated robot scene. Here is exactly how to implement it:

**1. Add Three.js via CDN** at the bottom of `index.html` before the closing `</body>` tag:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

**2. Replace the `<aside class="hero-visual">` block** with this:
```html
<aside class="hero-visual" aria-label="3D Robot animation">
  <canvas id="robot-canvas"></canvas>
  <p>Automation-first architecture for modern operations and connected workflows.</p>
</aside>
```

**3. In `script.js`, add a full Three.js scene** that does the following:

- Create a Three.js `WebGLRenderer` attached to `#robot-canvas`, with `alpha: true` and `antialias: true`
- Set canvas size to match the `.hero-visual` container (use `ResizeObserver` to keep it responsive)
- Create a `PerspectiveCamera` at position `(0, 1.5, 5)` looking at `(0, 0.5, 0)`
- Add ambient light (`#ffffff`, intensity 0.4) and a directional neon light (`#00f5ff`, intensity 1.2) from position `(3, 5, 3)`, plus a point light (`#ff7a18`, intensity 0.8) at `(-2, 2, 2)`

**Build a robot character from Three.js primitives** (no external GLTF files needed):

Use `BoxGeometry` and `CylinderGeometry` shapes to construct a robot made of these parts:
- **Head**: `BoxGeometry(0.7, 0.7, 0.7)` — glowing cyan emissive material (`#00f5ff`, emissiveIntensity: 0.3)
- **Eyes**: Two small `BoxGeometry(0.12, 0.12, 0.05)` placed on the head face — use emissive orange (`#ff7a18`, emissiveIntensity: 1.5) to make them glow brightly
- **Antenna**: `CylinderGeometry(0.03, 0.03, 0.4)` on top of the head with a small sphere tip that pulses
- **Torso**: `BoxGeometry(1.0, 1.2, 0.6)` — dark metal material (`#131b28`) with cyan emissive chest panel
- **Chest panel**: Small `BoxGeometry(0.5, 0.4, 0.05)` on the torso front with emissive blue glow (`#0f58a8`)
- **Arms**: Two `CylinderGeometry(0.18, 0.15, 1.0)` for upper arms, connected to `BoxGeometry(0.2, 0.3, 0.2)` hands
- **Legs**: Two `BoxGeometry(0.3, 0.8, 0.3)` with `BoxGeometry(0.35, 0.15, 0.45)` feet
- **Use `MeshStandardMaterial`** for all parts with `metalness: 0.8` and `roughness: 0.2`
- Group all parts into a single `THREE.Group` called `robot`

**Animations** (in the `animate()` loop using `requestAnimationFrame`):
- Robot **floats up and down** slowly: `robot.position.y = Math.sin(Date.now() * 0.001) * 0.15`
- Robot **rotates slightly** left/right on Y axis: `robot.rotation.y = Math.sin(Date.now() * 0.0005) * 0.3`
- **Arms swing** independently: left arm rotates on Z axis `Math.sin(Date.now() * 0.002) * 0.25`, right arm the opposite
- **Head tilts** slightly: `head.rotation.z = Math.sin(Date.now() * 0.0015) * 0.08`
- **Antenna tip pulses**: scale it `0.8 + Math.sin(Date.now() * 0.005) * 0.2`
- **Eye glow pulses**: emissiveIntensity oscillates between 1.0 and 2.0 using sine

**Particle background** inside the canvas:
- Create 120 small `SphereGeometry(0.015)` particles scattered in a `(-3 to 3, -2 to 4, -3 to 1)` bounding box
- Give them emissive cyan or orange material at low opacity (0.6)
- In the animation loop, slowly drift particles upward and reset to bottom when they go above y=4
- This creates a floating data/energy particle effect around the robot

**Add a subtle ground glow** under the robot: a flat `CircleGeometry(0.8)` disc with orange emissive material at low opacity, slightly below the robot

---

### ✨ ADDITIONAL MICRO-ANIMATIONS (CSS + JS)

Add to `style.css`:
- **Glitch effect** on the main `<h1>` on page load — a brief 0.6s CSS `@keyframes glitch` animation that shifts text-shadow colors horizontally
- **Typing cursor blink** on the `.eyebrow` text above the h1 — add a blinking `|` cursor using CSS `::after` pseudo-element
- **Neon pulse** on the `.nav-cta` button: `@keyframes neonPulse` that animates `box-shadow` between orange and cyan glow every 2s
- **Hover lift** on all `.card` elements: `transform: translateY(-6px)` with a cyan glow `box-shadow` on hover

Add to `script.js`:
- **Scroll-triggered neon reveal**: when `.process-step` elements enter the viewport, add a class that triggers a left-border neon orange animation
- **Mouse parallax**: on `mousemove`, slightly shift the robot canvas container `transform: translate()` by 1-2% of mouse position for a depth illusion

---

### 📁 FILE STRUCTURE

Keep the output as the same 3 files:
- `index.html` — add Three.js CDN script tag, replace hero-visual aside
- `style.css` — add all new cyberpunk styles at the bottom, do not remove existing styles
- `script.js` — add Three.js robot scene at the top in a self-contained `initRobotScene()` function, call it on `DOMContentLoaded`

Do not change `terms.html`, `privacy.html`, or `logo.png`.
Do not use any build tools, bundlers, or npm packages — CDN only.
Do not use TypeScript — plain ES6 JavaScript only.

---

### ✅ EXPECTED RESULT

When done, opening `index.html` in a browser should show:
1. A dark cyberpunk IT agency website with neon glows, glassmorphism cards, and circuit-board textures
2. A 3D animated robot floating and moving in the hero section right side
3. Glowing particle effects around the robot
4. Smooth scroll animations and neon hover effects throughout
5. All original content (services, estimator, packages, contact form) intact and functional

---

*Start with `index.html`, then `style.css`, then `script.js`. Show me each file fully updated.*
