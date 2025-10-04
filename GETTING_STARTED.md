# 🚀 Getting Started with QR Code Generator

## Quick Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/abhix201/QR-Code-Generator.git
cd QR-Code-Generator

# 2. Install dependencies
npm install

# 3. Choose your preferred server:

# 🔥 Development Server (Recommended for development)
npm run dev
# ✅ Features: Live reload, auto-refresh, opens browser automatically
# 🌐 URL: http://localhost:3000

# 🚀 Production Server (Recommended for testing)
npm start
# ✅ Features: Production-like serving, optimized performance
# 🌐 URL: http://localhost:8000

# 🛠️ Alternative Server
npm run serve
# ✅ Features: HTTP server with cache control, auto-opens browser
# 🌐 URL: http://localhost:8080

# 👀 Preview Server
npm run preview
# ✅ Features: Static file serving, good for previews
# 🌐 URL: http://localhost:5000
```

## 🛠️ Development Commands

| Command           | Purpose                      | When to Use                                                  |
| ----------------- | ---------------------------- | ------------------------------------------------------------ |
| `npm run dev`     | Development with live reload | 🔧 **Active development** - Changes reflect instantly        |
| `npm start`       | Production-like server       | 🚀 **Testing final version** - Mimics production environment |
| `npm run serve`   | Alternative HTTP server      | 🔄 **Alternative option** - If other servers have issues     |
| `npm run preview` | Simple static server         | 👁️ **Quick preview** - Fast static file serving              |

## 🎯 Recommended Workflow

### For Development:

```bash
npm run dev
```

- Opens browser automatically at `http://localhost:3000`
- Live reload - changes appear instantly
- Best for active development

### For Testing:

```bash
npm start
```

- Visit `http://localhost:8000` manually
- Production-like behavior
- Best for final testing before deployment

## 🔧 Additional Commands

```bash
# Code Quality
npm run lint          # Check code quality
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Prettier
npm run validate      # Run all quality checks

# Utilities
npm run clean         # Clean npm cache
```

## 🌟 Features You'll See

Once the server is running, you'll have access to:

- ⚡ **Instant QR Generation** - Create QR codes in real-time
- 🎨 **Beautiful Modern UI** - Responsive design that works on all devices
- 📱 **PWA Support** - Install as an app on mobile devices
- 🔧 **Customizable Options** - Size, format, error correction levels
- 📥 **Easy Download** - One-click download in multiple formats
- 📋 **Copy & Share** - Copy links or use native sharing
- ⌨️ **Keyboard Shortcuts** - Fast navigation with hotkeys
- ♿ **Accessibility** - Screen reader friendly

## 🚨 Troubleshooting

### Port Already in Use?

```bash
# Try alternative ports
npm run serve    # Port 8080
npm run preview  # Port 5000
```

### Dependencies Issues?

```bash
# Clean install
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### Live Reload Not Working?

- Make sure you're using `npm run dev`
- Check if port 3000 is available
- Try refreshing the browser

## 🎉 You're Ready!

Your QR Code Generator is now running with modern Node.js/npm tooling instead of Python's simple HTTP server. Enjoy the enhanced development experience with live reload and better performance! 🚀
