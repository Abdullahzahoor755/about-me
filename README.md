# 🚀 Futuristic 3D Portfolio

A stunning, highly modern, futuristic portfolio website featuring Three.js 3D elements, interactive animations, and premium UI design. Built with pure HTML, CSS, and JavaScript - no frameworks required.

![Portfolio Preview](https://img.shields.io/badge/Portfolio-Futuristic%203D-blueviolet?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech%20Stack-HTML%20%7C%20CSS%20%7C%20JS%20%7C%20Three.js-00f3ff?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Responsive-Fully%20Adaptive-brightgreen?style=for-the-badge)

## ✨ Features

### 🎨 Visual Design
- **3D Background** - Interactive Three.js particle system with floating geometric shapes
- **Glassmorphism Effects** - Modern frosted glass UI elements throughout
- **Neon Glow Effects** - Cyan, purple, and pink neon accents with glow animations
- **Animated Grid Floor** - Perspective grid that pulses and moves
- **Custom Cursor** - Glowing cursor that responds to interactive elements

### 🎬 Animations & Interactions
- **Typing Effect** - Animated text cycling through "AI Developer", "Agentic AI Engineer", "Python Developer"
- **Character Reveal** - Hero title letters animate in with staggered timing
- **3D Card Tilt** - Cards respond to mouse movement with 3D rotation
- **Scroll Animations** - Elements fade in and slide as you scroll
- **Parallax Effects** - Subtle depth on scroll
- **Particle Burst** - Click effects on buttons
- **Magnetic Buttons** - Buttons subtly follow the cursor

### 📱 Sections
1. **Hero Section** - Animated profile with orbital rings, typing effect, and tech pills
2. **About Section** - Glassmorphism panel with animated statistics
3. **Skills Section** - 3D cards with animated progress bars
4. **Projects Section** - Interactive 3D project cards
5. **Contact Section** - Animated form with glow effects
6. **Footer** - Social links with hover animations

### 🛠️ Technical Features
- **Three.js Integration** - Full 3D background with particles and shapes
- **Smooth Scrolling** - Custom scroll behavior with navigation highlighting
- **Mobile Responsive** - Fully adaptive for all screen sizes
- **Performance Optimized** - GPU-accelerated animations, efficient rendering
- **Accessibility** - Keyboard navigation, reduced motion support

## 📁 Project Structure

```
/
├── index.html              # Main portfolio page
├── portfolio.html          # Redirect to new portfolio
├── css/
│   └── style.css          # Complete stylesheet with all animations
├── js/
│   └── main.js            # JavaScript with Three.js and all interactions
└── README.md              # This file
```

## 🚀 Getting Started

### Option 1: Direct Open
Simply open `index.html` in your browser:
```bash
# On Linux/macOS
open index.html

# On Windows
start index.html
```

### Option 2: Local Server (Recommended)
For the best experience with Three.js and smooth animations:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🎨 Customization Guide

### Changing Colors
Edit the CSS variables in `css/style.css`:

```css
:root {
    --neon-blue: #00f3ff;      /* Primary accent */
    --neon-purple: #bc13fe;    /* Secondary accent */
    --neon-pink: #ff10f0;      /* Tertiary accent */
    --dark-bg: #0a0a0f;        /* Background color */
    /* ... */
}
```

### Changing the Profile Image
In `index.html`, find the profile section:

```html
<div class="profile-core">
    <img src="YOUR_IMAGE_URL" alt="Your Name">
</div>
```

### Changing Typing Text
In `js/main.js`, modify the typing effect array:

```javascript
new TypingEffect(typingElement, [
    'Your Text 1',
    'Your Text 2',
    'Your Text 3'
], {
    typeSpeed: 80,
    deleteSpeed: 50,
    pauseDuration: 2000
});
```

### Adding/Modifying Skills
In `index.html`, duplicate a skill card and customize:

```html
<div class="skill-card">
    <div class="skill-card-glow"></div>
    <div class="skill-icon-wrapper">
        <i class="fas fa-[icon-name] skill-icon"></i>
    </div>
    <h3>Skill Name</h3>
    <p>Description</p>
    <div class="skill-progress">
        <!-- Progress bar -->
    </div>
</div>
```

### Adding Projects
In the projects section, add a new card:

```html
<div class="project-card">
    <div class="project-image">
        <img src="project-image.jpg" alt="Project">
        <div class="project-image-overlay"></div>
        <span class="project-category">Category</span>
    </div>
    <div class="project-content">
        <h3>Project Name</h3>
        <p>Description</p>
        <div class="project-tech">
            <span>Tech 1</span>
            <span>Tech 2</span>
        </div>
        <div class="project-links">
            <a href="#" class="project-link primary">Live Demo</a>
            <a href="#" class="project-link">Code</a>
        </div>
    </div>
</div>
```

## 🌟 Animation Classes

Use these classes to animate elements:

| Class | Effect |
|-------|--------|
| `.reveal` | Fade in from bottom |
| `.reveal-left` | Fade in from left |
| `.reveal-right` | Fade in from right |
| `.reveal-scale` | Scale up and fade in |
| `.stagger-1` to `.stagger-6` | Delay animations |

Example:
```html
<div class="card reveal stagger-2">Content</div>
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ⚡ Performance Tips

1. **Optimize Images** - Use WebP format where possible
2. **Limit Particles** - Reduce particle count on mobile
3. **Disable Animations** - Site respects `prefers-reduced-motion`
4. **Use CDN** - Three.js and fonts loaded from CDN

## 🛠️ Built With

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox, Animations
- **JavaScript** - ES6+ features
- **Three.js** - 3D graphics library
- **Font Awesome** - Icons
- **Google Fonts** - Orbitron, Rajdhani, Inter

## 📄 License

Feel free to use this portfolio template for your own projects!

## 🙏 Credits

- Fonts: Google Fonts (Orbitron, Rajdhani, Inter)
- Icons: Font Awesome
- 3D Library: Three.js
- Images: Unsplash (placeholder images)

---

**Enjoy your new futuristic portfolio!** 🚀
