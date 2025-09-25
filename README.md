# Driving Classics - Webflow Custom Code

A simple, clean JavaScript setup for the Driving Classics website.

## Setup Instructions

### 1. GitHub Integration
- This JavaScript file is designed to be linked directly through Webflow's site settings
- Use the GitHub link: `https://raw.githubusercontent.com/[your-username]/[your-repo]/main/driving-classics.js`

### 2. Webflow Implementation
- Go to your Webflow site settings
- Navigate to Custom Code
- Add the JavaScript file link in the `<head>` section
- No CSS file needed - all styling handled through Webflow site settings

### 3. File Structure
```
driving-classics.js    # Main JavaScript file
README.md             # This documentation
```

## Features

- **Clean initialization** with proper error handling
- **Webflow integration** ready
- **Modular structure** for easy expansion
- **Console logging** for debugging
- **Error handling** throughout

## Customization

### Adding New Features
1. Create a new function in the appropriate section
2. Call it from `initDrivingClassics()`
3. Add proper error handling

### Example:
```javascript
function initNewFeature() {
    try {
        // Your new feature logic here
        console.log('[Driving Classics] New feature initialized');
    } catch (error) {
        console.error('[Driving Classics] New feature error:', error);
    }
}
```

## Browser Compatibility
- Modern browsers (ES6+)
- Webflow compatibility
- Mobile responsive ready

## Support
For issues or questions, check the browser console for detailed logging.



