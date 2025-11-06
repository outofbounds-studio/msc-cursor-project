# Webflow Skip Navigation Buttons Setup Guide

## Overview
This guide explains how to create the skip navigation buttons in Webflow that work with the scroll sequence animation.

## Required Elements

### 1. Container Div
- **Class Name**: `scroll-sequence-skip-buttons`
- **Position**: Fixed
- **Location**: Bottom-right corner (or wherever you prefer)
- **Z-index**: High (e.g., 9999) to ensure it's above other content
- **Layout**: Flexbox, column direction
- **Gap**: 12px between buttons
- **Initial State**: Can be visible or hidden (JS will control visibility)

### 2. Jump to Bottom Button
- **Class Name**: `scroll-sequence-skip-to-bottom`
- **Type**: Button element (or Link Block styled as button)
- **Content**: Down arrow icon (↓) or text like "Skip to End"
- **Styling Suggestions**:
  - Circular button (48px × 48px recommended)
  - Background: White with transparency (rgba(255, 255, 255, 0.9))
  - Border: None or subtle border
  - Shadow: Box shadow for depth
  - Backdrop blur: Optional (blur(10px))
- **Position**: Inside the container, stacked vertically

### 3. Jump to Top Button
- **Class Name**: `scroll-sequence-skip-to-top`
- **Type**: Button element (or Link Block styled as button)
- **Content**: Up arrow icon (↑) or text like "Back to Start"
- **Styling**: Same as jump to bottom button
- **Position**: Inside the container, below the jump to bottom button

## Step-by-Step Instructions

### Step 1: Create the Container
1. Add a **Div Block** to your page
2. Set it to **Fixed Position**
3. Position it at:
   - **Bottom**: 24px
   - **Right**: 24px
4. Add class: `scroll-sequence-skip-buttons`
5. Set **Display** to **Flex**
6. Set **Flex Direction** to **Column**
7. Set **Gap** to **12px**
8. Set **Z-index** to **9999** (or high value)

### Step 2: Create Jump to Bottom Button
1. Inside the container, add a **Button** element
2. Add class: `scroll-sequence-skip-to-bottom`
3. Style the button:
   - **Width**: 48px
   - **Height**: 48px
   - **Border Radius**: 50% (for circular)
   - **Background**: White with opacity (rgba(255, 255, 255, 0.9))
   - **Border**: None
   - **Box Shadow**: 0 4px 12px rgba(0, 0, 0, 0.15)
   - **Backdrop Filter**: blur(10px) (optional)
4. Add content:
   - Option A: Add an icon (down arrow SVG or icon font)
   - Option B: Add text like "Skip" or "↓"
5. Center the content (flexbox center alignment)

### Step 3: Create Jump to Top Button
1. Inside the container, add another **Button** element
2. Add class: `scroll-sequence-skip-to-top`
3. Apply the same styling as the bottom button
4. Add content:
   - Option A: Add an icon (up arrow SVG or icon font)
   - Option B: Add text like "Back" or "↑"

### Step 4: Initial Visibility (Optional)
- You can set both buttons to **Opacity: 0** initially
- The JavaScript will handle showing/hiding them based on scroll progress
- Or leave them visible - JS will control visibility on scroll

## CSS Classes Summary

```
.scroll-sequence-skip-buttons (Container)
  ├── .scroll-sequence-skip-to-bottom (Button 1)
  └── .scroll-sequence-skip-to-top (Button 2)
```

## Behavior

The JavaScript will automatically:
- Show "Jump to Bottom" button when scroll progress is between 10% and 80%
- Show "Jump to Top" button when scroll progress is above 80%
- Hide buttons when not in the scroll sequence section
- Animate button appearance/disappearance smoothly
- Handle click events to scroll to top/bottom of the sequence

## Testing

After creating the buttons in Webflow:
1. Publish your site
2. Navigate to the homepage
3. Scroll through the animation sequence
4. You should see:
   - "Jump to Bottom" button appear after ~10% scroll
   - "Jump to Top" button appear after ~80% scroll
5. Click the buttons to test smooth scrolling

## Troubleshooting

If buttons don't appear:
1. Check browser console for: "Skip navigation buttons not found - create them in Webflow with the required classes"
2. Verify class names match exactly (case-sensitive):
   - `.scroll-sequence-skip-buttons`
   - `.scroll-sequence-skip-to-bottom`
   - `.scroll-sequence-skip-to-top`
3. Ensure buttons are on the page (not hidden by display:none)
4. Check that the scroll sequence container exists on the page

## Customization

You can customize:
- Button size (adjust width/height)
- Button position (change bottom/right values in Webflow)
- Button styling (colors, shadows, borders)
- Button content (icons, text, or both)
- Animation thresholds (edit the 0.1 and 0.8 values in the JS if needed)

