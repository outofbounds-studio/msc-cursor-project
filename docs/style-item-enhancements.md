# Style-Item Page Enhancements

This document outlines the enhanced text animations and slider functionality that have been added to individual style pages.

## Text Animations

### 1. Mask Text Scroll Reveal

Automatically animates headings with the `[data-split="heading"]` attribute when they come into view.

**Usage:**
```html
<h2 data-split="heading" data-split-reveal="lines">Your Heading Text</h2>
<h3 data-split="heading" data-split-reveal="words">Another Heading</h3>
<h1 data-split="heading" data-split-reveal="chars">Character by Character</h1>
```

**Options:**
- `data-split-reveal="lines"` - Animates line by line (default)
- `data-split-reveal="words"` - Animates word by word
- `data-split-reveal="chars"` - Animates character by character
- `data-split-hero` - For hero sections, triggers earlier

### 2. Scramble Text Animations

Creates scramble effects on text elements.

**Usage:**
```html
<!-- On page load -->
<h2 data-scramble="load">Scrambled on Load</h2>

<!-- On scroll -->
<p data-scramble="scroll">Scrambled on Scroll</p>

<!-- Alternative scramble style -->
<p data-scramble="scroll" data-scramble-alt>Alternative Scramble</p>

<!-- On hover -->
<div data-scramble-hover="link">
    <span data-scramble-hover="target" data-scramble-text="Hover Text">Original Text</span>
</div>
```

### 3. Number Ticker Animation

Animates numbers counting up from 0 to their target value.

**Usage:**
```html
<span data-animate-number="1000">1000</span>
<span data-animate-number="42.5">42.5</span>
```

### 4. Divider Line Reveal

Animates divider lines from 0% to 100% width.

**Usage:**
```html
<div class="divider-line"></div>
```

### 5. First Word Span Wrapping

Automatically wraps the first word of paragraphs with the `.indent-first-word` class.

**Usage:**
```html
<p class="indent-first-word">This first word will be wrapped in a span.</p>
```

### 6. Spec Line Reveal

Animates specification lines with a sliding effect.

**Usage:**
```html
<div class="spec-line">Specification Item</div>
```

## Enhanced Slider Functionality

### 1. Enhanced Main Sliders

The existing `.slider-main_component` sliders now have enhanced features:

**New Attributes:**
```html
<div class="slider-main_component" 
     loop-mode="true" 
     slider-duration="450" 
     autoplay="true" 
     autoplay-delay="5000">
    <!-- Slider content -->
</div>
```

**Enhanced Features:**
- Autoplay with pause on hover
- Dynamic pagination bullets
- Smooth transitions with custom classes
- Touch feedback
- Enhanced navigation with hover effects
- Parallax effects on images

### 2. Slider Parallax Effects

Images within sliders automatically get parallax effects:
- Scroll-based parallax (y-axis movement)
- Hover scale effects
- Navigation button parallax

### 3. Advanced Slider Events

Sliders now include:
- `init` - Adds enhanced styling classes
- `slideChange` - Enhanced transition effects
- `touchStart/touchEnd` - Touch feedback

## CSS Classes Added

### Enhanced Slider Classes
- `.enhanced-slider` - Applied to enhanced sliders
- `.is-transitioning` - Applied during slide transitions
- `.is-touching` - Applied during touch interactions

### Text Animation Classes
- `.line` - Split text lines
- `.word` - Split text words
- `.letter` - Split text characters
- `.first-word` - First word wrapper
- `.revealed` - Applied to revealed spec lines

## Implementation Notes

### Automatic Initialization
All these features are automatically initialized on style-item pages through the Barba.js page transitions:

```javascript
'style-item': {
    afterEnter() {
        // ... existing code ...
        
        // Enhanced text animations
        initMaskTextScrollReveal();
        initDividerLineReveal();
        wrapFirstWordInSpan();
        initSpecLineReveal();
        
        // Enhanced slider functionality
        initEnhancedSliders();
        initSliderParallax();
    }
}
```

### Performance Considerations
- All animations use GSAP for optimal performance
- ScrollTrigger instances are properly cleaned up on page leave
- SplitText instances are reverted to prevent memory leaks
- Animations are optimized for 60fps performance

### Browser Compatibility
- All features work in modern browsers (Chrome, Firefox, Safari, Edge)
- Fallbacks are in place for older browsers
- Touch interactions are optimized for mobile devices

## Customization

### Animation Timing
You can customize animation timing by modifying the GSAP configurations in the respective functions.

### Styling
All animations can be styled using the provided CSS classes. The animations are designed to work with the existing design system.

### Adding New Animations
To add new text animations:
1. Create the animation function
2. Add it to the style-item `afterEnter` method
3. Add corresponding CSS styles
4. Update this documentation

## Troubleshooting

### Common Issues
1. **Animations not triggering**: Check that elements have the correct data attributes
2. **Performance issues**: Ensure ScrollTrigger instances are being cleaned up
3. **Styling conflicts**: Check for conflicting CSS rules

### Debug Mode
Enable debug mode by setting `markers: true` in ScrollTrigger configurations to see trigger points.

## Examples

### Complete Style-Item Page Structure
```html
<div data-barba="container" data-barba-namespace="style-item">
    <!-- Hero Section -->
    <section class="hero">
        <h1 data-split="heading" data-split-reveal="chars" data-split-hero>
            Style Title
        </h1>
        <p data-scramble="load">Scrambled description</p>
    </section>
    
    <!-- Gallery Slider -->
    <section class="gallery">
        <div class="slider-main_component" autoplay="true" autoplay-delay="4000">
            <div class="swiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <img src="image1.jpg" alt="Style Image">
                    </div>
                    <!-- More slides -->
                </div>
            </div>
            <div class="swiper-pagination swiper-bullet-wrapper"></div>
            <div class="swiper-button-next swiper-next"></div>
            <div class="swiper-button-prev swiper-prev"></div>
        </div>
    </section>
    
    <!-- Specifications -->
    <section class="specs">
        <div class="spec-line">Material: Premium Cotton</div>
        <div class="spec-line">Weight: 280 GSM</div>
        <div class="divider-line"></div>
        <p class="indent-first-word">Detailed description with first word indented.</p>
    </section>
    
    <!-- Statistics -->
    <section class="stats">
        <div class="stat">
            <span data-animate-number="95">95</span>% Satisfaction
        </div>
    </section>
</div>
```

This enhancement provides a rich, interactive experience for style-item pages with smooth animations and engaging slider functionality. 