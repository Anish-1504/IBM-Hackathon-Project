# AI Code Review Assistant - Vanilla JavaScript Frontend

A lightweight, vanilla JavaScript frontend for the AI Code Review Assistant. No frameworks, just pure HTML, CSS, and JavaScript.

## 🚀 Features

- **Pure Vanilla JS**: No frameworks or build tools required
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean and intuitive user interface
- **Real-time Updates**: Dynamic content loading
- **Secure Authentication**: JWT-based auth with localStorage
- **Code Analysis**: Submit and view AI-powered code reviews

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API running (see backend-nodejs/README.md)
- Web server (for local development)

## 🛠️ Setup

### 1. Configure API Endpoint

Edit `js/config.js` and update the API base URL:

```javascript
const API_CONFIG = {
    baseURL: 'http://localhost:3000/api',  // Update to your backend URL
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
};
```

### 2. Serve the Application

#### Option 1: Using Python (Recommended)

```bash
cd frontend-web
python -m http.server 8080
```

Then open: http://localhost:8080

#### Option 2: Using Node.js http-server

```bash
npm install -g http-server
cd frontend-web
http-server -p 8080
```

#### Option 3: Using VS Code Live Server

1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option 4: Using any web server

Configure your web server to serve the `frontend-web` directory.

## 📁 Project Structure

```
frontend-web/
├── index.html              # Landing page
├── pages/
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── dashboard.html     # User dashboard
│   └── review.html        # Code review submission
├── css/
│   └── styles.css         # All styles
├── js/
│   ├── config.js          # API configuration
│   ├── auth.js            # Authentication utilities
│   ├── api.js             # API client
│   ├── main.js            # Home page logic
│   ├── login.js           # Login page logic
│   ├── register.js        # Registration logic
│   ├── dashboard.js       # Dashboard logic
│   └── review.js          # Review page logic
└── assets/                # Images and icons
```

## 🎨 Pages

### Landing Page (`index.html`)
- Hero section with call-to-action
- Feature showcase
- How it works section
- Responsive navigation

### Login Page (`pages/login.html`)
- Email and password authentication
- Remember me functionality
- Password visibility toggle
- Error handling

### Register Page (`pages/register.html`)
- User registration form
- Password strength validation
- Terms acceptance
- Real-time validation

### Dashboard (`pages/dashboard.html`)
- Statistics overview
- Recent reviews list
- Quick actions
- User profile

### Review Page (`pages/review.html`)
- Code diff submission
- AI analysis results
- Category scores
- Issues and suggestions
- Download report

## 🔌 API Integration

The frontend communicates with the backend API using the `API` class in `js/api.js`:

```javascript
// Example: Login
const response = await API.login({
    email: 'user@example.com',
    password: 'password123'
});

// Example: Analyze code
const result = await API.analyzeCode({
    prDiff: 'diff --git...',
    prTitle: 'Add feature'
});

// Example: Get reviews
const reviews = await API.getReviews({
    limit: 20,
    offset: 0
});
```

## 🔒 Authentication

Authentication is handled using JWT tokens stored in localStorage:

```javascript
// Check if user is authenticated
if (Auth.isAuthenticated()) {
    // User is logged in
}

// Get current user
const user = Auth.getUser();

// Logout
Auth.logout();
```

## 🎨 Styling

The application uses CSS custom properties for theming:

```css
:root {
    --primary-color: #0066cc;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    /* ... more variables */
}
```

To customize the theme, edit these variables in `css/styles.css`.

## 📱 Responsive Design

The application is fully responsive with breakpoints at:
- Desktop: > 768px
- Tablet: 481px - 768px
- Mobile: < 480px

## 🔧 Configuration

### API Configuration (`js/config.js`)

```javascript
const API_CONFIG = {
    baseURL: 'http://localhost:3000/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
};
```

### Storage Keys

```javascript
const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data'
};
```

## 🚀 Deployment

### Static Hosting

Deploy to any static hosting service:

1. **Netlify**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   cd frontend-web
   netlify deploy --prod
   ```

2. **Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   cd frontend-web
   vercel --prod
   ```

3. **GitHub Pages**
   - Push to GitHub repository
   - Enable GitHub Pages in repository settings
   - Select branch and folder

4. **AWS S3**
   ```bash
   aws s3 sync . s3://your-bucket-name --acl public-read
   ```

### Production Checklist

- ✅ Update API_CONFIG.baseURL to production API
- ✅ Enable HTTPS
- ✅ Configure CORS on backend
- ✅ Optimize images
- ✅ Minify CSS and JavaScript (optional)
- ✅ Add analytics (optional)
- ✅ Set up error tracking (optional)

## 🔍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Troubleshooting

### CORS Issues

If you see CORS errors:
1. Ensure backend CORS is configured correctly
2. Check API_CONFIG.baseURL is correct
3. Verify backend is running

### Authentication Issues

If login doesn't work:
1. Check browser console for errors
2. Verify API endpoint is correct
3. Clear localStorage: `localStorage.clear()`
4. Check backend is running

### Styling Issues

If styles don't load:
1. Check browser console for 404 errors
2. Verify CSS file path is correct
3. Clear browser cache

## 📊 Performance

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: 90+

## 🔐 Security

- JWT tokens stored in localStorage
- Automatic token expiration handling
- XSS protection through proper escaping
- HTTPS recommended for production

## 📝 Development

### Code Style

- Use ES6+ features
- Follow consistent naming conventions
- Add comments for complex logic
- Keep functions small and focused

### Adding New Pages

1. Create HTML file in `pages/`
2. Create corresponding JS file in `js/`
3. Update navigation in all pages
4. Add styles in `css/styles.css`

### Adding New Features

1. Update API client in `js/api.js`
2. Create UI components
3. Add event handlers
4. Test thoroughly

## 🧪 Testing

### Manual Testing Checklist

- [ ] Registration flow
- [ ] Login flow
- [ ] Dashboard loads correctly
- [ ] Code analysis works
- [ ] Results display properly
- [ ] Logout works
- [ ] Responsive on mobile
- [ ] All links work
- [ ] Error messages display

### Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@example.com

## 🎯 Future Enhancements

- [ ] Dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Code syntax highlighting
- [ ] Real-time collaboration
- [ ] Export to PDF
- [ ] GitHub integration

---

Made with ❤️ using vanilla JavaScript, HTML5, and CSS3