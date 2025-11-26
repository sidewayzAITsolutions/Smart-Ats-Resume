## SmartATS Mobile (Expo)

This Expo application brings the Smart ATS Resume experience to iOS and Android with feature parity to the marketing site plus mobile-native perks.

### Highlights

- Gradient hero, ATS demo, feature explainers, and pricing content that mirrors the web landing page.
- Mobile-first perks: offline editing, share-sheet ingestion ("Job Drop"), and push intelligence callouts.
- Swipeable template gallery using the same creative assets as the web product.
- Buttons trigger subtle haptics and deep-link to existing SmartATS web flows.

### Getting Started

```bash
cd smart-ats-mobile
npm install
npm run start   # choose iOS, Android, or Web from the Expo CLI
```

### Ship Checklist

- Update `app.json` `extra.eas.projectId` with the real EAS project ID before building.
- Provide production icons/splash artwork in `assets/`.
- Run `expo prebuild` + `eas build` when ready for App Store / Play Store submissions.


