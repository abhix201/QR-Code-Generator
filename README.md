# 🚀 QR Code Generator

> A modern, feature-rich QR code generator with beautiful UI and advanced functionality

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://abhijeet-gupta-portfolio.appwrite.network/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/abhix201)

## ✨ Features

### 🎯 Core Functionality

- **Instant QR Generation**: Create QR codes in seconds for any text or URL
- **Multiple Input Types**: Supports URLs, plain text, phone numbers, emails, and more
- **Smart Detection**: Automatically detects and formats different input types
- **Real-time Preview**: See your QR code update as you type

### 🎨 Customization Options

- **Multiple Sizes**: Small (200×200) to Extra Large (500×500)
- **Various Formats**: PNG, JPG, GIF, and SVG output
- **Error Correction Levels**: Low, Medium, Quartile, and High
- **Professional Design**: Modern, responsive UI with smooth animations

### 🔧 Advanced Features

- **Download & Share**: Easy download and native sharing capabilities
- **Copy to Clipboard**: One-click copying of QR codes and links
- **Keyboard Shortcuts**: Fast navigation with keyboard shortcuts
- **Mobile Optimized**: Perfect experience on all devices
- **Accessibility**: Full screen reader and keyboard navigation support
- **Loading States**: Visual feedback during generation
- **Error Handling**: Comprehensive error messages and validation

### 🌟 User Experience

- **Dark Mode Support**: Automatic dark/light mode detection
- **Offline Ready**: Works without internet after initial load
- **Fast Performance**: Optimized for speed and efficiency
- **Privacy Focused**: No data stored on servers

## 🚀 Quick Start

### Option 1: Use Online (Recommended)

Visit [abhijeet-gupta-portfolio.appwrite.network](https://abhijeet-gupta-portfolio.appwrite.network/) to use the live version immediately.

### Option 2: Local Development

1. **Clone the repository**

    ```bash
    git clone https://github.com/abhix201/QR-Code-Generator.git
    cd QR-Code-Generator
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Run the development server**

    ```bash
    # Option 1: Development server with live reload (recommended)
    npm run dev
    # Opens automatically at http://localhost:3000 with live reload

    # Option 2: Production-like server
    npm start
    # Visit http://localhost:8000

    # Option 3: Alternative server
    npm run serve
    # Opens automatically at http://localhost:8080

    # Option 4: Preview server
    npm run preview
    # Visit http://localhost:5000
    ```

## 📋 Available Scripts

| Command                | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Start development server with live reload (port 3000) |
| `npm start`            | Start production server (port 8000)                   |
| `npm run serve`        | Start alternative server (port 8080)                  |
| `npm run preview`      | Start preview server (port 5000)                      |
| `npm run lint`         | Run ESLint and Stylelint                              |
| `npm run lint:fix`     | Auto-fix linting issues                               |
| `npm run format`       | Format code with Prettier                             |
| `npm run format:check` | Check code formatting                                 |
| `npm run validate`     | Run all linting and formatting checks                 |

## 💡 Usage Examples

### Basic Text

```
Hello, World!
```

### Website URL

```
https://github.com/abhix201
```

### Phone Number

```
+1 (555) 123-4567
```

### Email Address

```
hello@example.com
```

### WiFi Network

```
WIFI:T:WPA;S:NetworkName;P:Password;;
```

## ⌨️ Keyboard Shortcuts

| Shortcut           | Action                     |
| ------------------ | -------------------------- |
| `Ctrl/Cmd + Enter` | Generate QR Code           |
| `Ctrl/Cmd + D`     | Download QR Code           |
| `Escape`           | Clear input or close modal |
| `Tab`              | Navigate between elements  |

## 🛠️ Technical Details

### Built With

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: ES6+ features with modular architecture
- **QR Server API**: Reliable QR code generation service

### Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Features

- **Lazy Loading**: Images and resources loaded on demand
- **Optimized CSS**: Minimized and organized stylesheets
- **Efficient JavaScript**: Event delegation and optimized DOM manipulation
- **Responsive Images**: Adaptive image sizing for different devices

## 🎨 Customization

### Color Scheme

The app uses CSS custom properties for easy theming:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
    /* ... more variables */
}
```

### Adding New Features

The modular JavaScript architecture makes it easy to extend:

```javascript
class QRCodeGenerator {
    // Add your custom methods here
    customFeature() {
        // Implementation
    }
}
```

## 📱 Mobile Experience

- **Touch Optimized**: Large touch targets and gesture support
- **Responsive Design**: Adapts to all screen sizes
- **PWA Ready**: Can be installed as a mobile app
- **Fast Loading**: Optimized for mobile networks

## 🔒 Privacy & Security

- **No Data Storage**: Your data is never stored on our servers
- **Client-Side Processing**: All processing happens in your browser
- **HTTPS Only**: Secure connection for all API calls
- **No Tracking**: No analytics or user tracking

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/QR-Code-Generator.git
cd QR-Code-Generator

# Install dependencies
npm install

# Create a new branch
git checkout -b feature/your-feature-name

# Start development server with live reload
npm run dev
```

## 📋 Roadmap

- [ ] **Batch QR Generation**: Generate multiple QR codes at once
- [ ] **QR Code Scanner**: Add scanning functionality
- [ ] **Advanced Customization**: Colors, logos, and styling options
- [ ] **Analytics Dashboard**: Usage statistics and insights
- [ ] **API Integration**: RESTful API for developers
- [ ] **Progressive Web App**: Full offline support
- [ ] **Multi-language Support**: Internationalization

## 🐛 Bug Reports & Feature Requests

Found a bug or have an idea? We'd love to hear from you!

- **Bug Reports**: [Create an Issue](https://github.com/abhix201/QR-Code-Generator/issues/new?template=bug_report.md)
- **Feature Requests**: [Request a Feature](https://github.com/abhix201/QR-Code-Generator/issues/new?template=feature_request.md)
- **Questions**: [Start a Discussion](https://github.com/abhix201/QR-Code-Generator/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **QR Server API** for reliable QR code generation
- **Inter Font** by Rasmus Andersson for beautiful typography
- **Heroicons** for clean and modern icons
- **CSS Grid and Flexbox** for responsive layouts

## 👨‍💻 Author

**Abhijeet Gupta**

- Website: [abhijeet-gupta-portfolio.appwrite.network](https://abhijeet-gupta-portfolio.appwrite.network/)
- GitHub: [@abhix201](https://github.com/abhix201)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/abhijeet-gupta-/)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/abhix201">Abhijeet Gupta</a></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
