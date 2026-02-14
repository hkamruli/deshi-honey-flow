

# Hero Product Image Redesign

## What Changes

### 1. Generate New Hero Jar Image
Use AI image generation to create a premium, realistic 3D honey jar with:
- Glass jar filled with golden honey
- Label reading "Deshi Foods - Natural Honey" (English branding)
- Warm, honey-gold studio background with soft lighting
- Cork or wooden lid for organic feel
- Honey drip details on the jar
- Cinematic warm lighting with natural shadows

### 2. Update Hero Image Container
Redesign the right side of the hero to match the reference layout:
- Add a **rounded-2xl container** with a warm background behind the product image (similar to the reference)
- The container will have a subtle warm gradient background that blends with the hero section
- Slight shadow and border-radius for a card-like presentation
- The discount badge will overlay on this container
- On mobile, the container will be centered and slightly smaller

### Technical Details

**Files to modify:**
- `src/assets/honey-jar-hero.png` -- regenerate with new AI prompt for a 3D realistic jar with warm background and "Deshi Foods - Natural Honey" branding
- `src/components/landing/HeroSection.tsx` -- update the image container to use a rounded card with warm background, matching the reference style

**Image container styling changes:**
- Wrap the `img` in a container with `rounded-2xl overflow-hidden` and a warm amber/gold background
- Add subtle inner shadow for depth
- Keep the discount badge overlaying the bottom-right of the container

