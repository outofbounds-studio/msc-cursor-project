import { build } from 'vite';
import fs from 'fs';
import path from 'path';

async function buildForWebflow() {
  try {
    // Clean dist directory
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true });
    }

    // Run production build
    await build({
      mode: 'production',
    });

    // Read the built file
    const builtFile = fs.readFileSync('dist/webflow.min.js', 'utf8');

    // Create Webflow-ready version with header comment
    const webflowVersion = `
/**
 * Custom JavaScript for Webflow
 * Built: ${new Date().toISOString()}
 * 
 * This code is minified and optimized for Webflow.
 * Paste this entire file into Site Settings > Custom Code > Footer Code
 */
${builtFile}
    `.trim();

    // Save Webflow version
    fs.writeFileSync('dist/webflow.js', webflowVersion);

    console.log('\n✨ Build complete! Files created:');
    console.log('- dist/webflow.min.js (Minified version)');
    console.log('- dist/webflow.js (Webflow-ready version with header)\n');
    
    // Log file sizes
    const minSize = (fs.statSync('dist/webflow.min.js').size / 1024).toFixed(2);
    const fullSize = (fs.statSync('dist/webflow.js').size / 1024).toFixed(2);
    
    console.log(`📦 Bundle sizes:`);
    console.log(`- Minified: ${minSize}KB`);
    console.log(`- Full: ${fullSize}KB\n`);
    
    if (fullSize > 100) {
      console.warn('⚠️  Warning: Bundle size is over 100KB. Consider optimizing to improve load times.');
    }

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildForWebflow();
