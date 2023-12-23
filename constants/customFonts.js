import { configureFonts } from "react-native-paper";

// First, define base font that will be used across the app.
// For MD3 this will apply to all base typography variants:
// displaySmall, headlineMedium, titleLarge etc.

const baseFont = { fontFamily: "DMSans-Regular" };
const baseVariants = configureFonts({ config: baseFont });

// Then, define custom fonts for different variants
// Customize individual base variants:

const customVariants = {
  displayLarge: {
    ...baseVariants.displayLarge,
    fontFamily: "DMSans-Bold",
  },
  displayMedium: {
    ...baseVariants.displayMedium,
    fontFamily: "DMSans-Regular",
  },
  displaySmall: {
    ...baseVariants.displaySmall,
    fontFamily: "DMSans-Regular",
  },
  headlineLarge: {
    ...baseVariants.headlineLarge,
    fontFamily: "DMSans-Bold",
  },
  headlineMedium: {
    ...baseVariants.headlineMedium,
    fontFamily: "DMSans-Regular",
  },
  headlineSmall: {
    ...baseVariants.headlineSmall,
    fontFamily: "DMSans-Regular",
  },
  titleLarge: {
    ...baseVariants.titleLarge,
    fontFamily: "DMSans-Medium",
  },
  titleMedium: {
    ...baseVariants.titleMedium,
    fontFamily: "DMSans-Bold",
  },
  titleSmall: {
    ...baseVariants.titleSmall,
    fontFamily: "DMSans-Medium",
  },
  bodyLarge: {
    ...baseVariants.bodyLarge,
    fontFamily: "DMSans-Regular",
  },
  bodyMedium: {
    ...baseVariants.bodyMedium,
    fontFamily: "DMSans-Regular",
  },
  bodySmall: {
    ...baseVariants.bodySmall,
    fontFamily: "DMSans-Regular",
  },
  labelLargeProminent: {
    ...baseVariants.labelLarge,
    fontFamily: "DMSans-SemiBold",
  },
  labelLarge: {
    ...baseVariants.labelLarge,
    fontFamily: "DMSans-Medium",
  },
  labelMediumProminent: {
    ...baseVariants.labelMedium,
    fontFamily: "DMSans-SemiBold",
  },
  labelMedium: {
    ...baseVariants.labelMedium,
    fontFamily: "DMSans-SemiBold",
  },
  labelSmall: {
    ...baseVariants.labelSmall,
    fontFamily: "DMSans-Medium",
  },
};

// Finally, merge base variants with your custom tokens
// and apply custom fonts to your theme.
