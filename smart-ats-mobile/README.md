## SmartATS Mobile (Expo)

This app rebuilds the Smart ATS Resume marketing experience for native mobile with thumb-friendly sections, ATS demos, template carousels, pricing, and mobile-only perks such as offline drafts, share-sheet keyword extraction, and push guidance.

### Getting started

```bash
cd smart-ats-mobile
npm install          # already run by create-expo-app, but safe to rerun
npm run start        # choose iOS, Android, or Web in the Expo CLI
```

### Notes

- App metadata (bundle IDs, splash, scheme) lives in `app.json`. Swap the placeholder EAS `projectId` before shipping.
- Images were copied from the web project into `assets/`.
- If the repo root contains another `node_modules`, run Expo commands from inside `smart-ats-mobile` using `npx expo start` to ensure the correct dependency tree is used.

