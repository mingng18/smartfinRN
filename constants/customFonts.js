import { configureFonts } from "react-native-paper";
import normalize from "../util/normalize";

// First, define base font that will be used across the app.
// For MD3 this will apply to all base typography variants:
// displaySmall, headlineMedium, titleLarge etc.

// const baseFont = { fontFamily: "DMSans-Regular" };
export const baseVariants = configureFonts();

// Then, define custom fonts for different variants
// Customize individual base variants:

export const customVariants = {
  displayLarge: {
    ...baseVariants.displayLarge,
    fontFamily: "DMSans-Bold",
    fontSize: normalize(baseVariants.displayLarge.fontSize)
  },
  displayMedium: {
    ...baseVariants.displayMedium,
    fontFamily: "DMSans-Bold",
    fontSize: normalize(baseVariants.displayMedium.fontSize)
  },
  displaySmall: {
    ...baseVariants.displaySmall,
    fontFamily: "DMSans-Regular",
    fontSize: normalize(baseVariants.displaySmall.fontSize)
  },
  headlineLarge: {
    ...baseVariants.headlineLarge,
    fontFamily: "DMSans-Bold",
    fontSize: normalize(baseVariants.headlineLarge.fontSize)
  },
  headlineMedium: {
    ...baseVariants.headlineMedium,
    fontFamily: "DMSans-Bold",
    fontSize: normalize(baseVariants.headlineMedium.fontSize)
  },
  headlineSmall: {
    ...baseVariants.headlineSmall,
    fontFamily: "DMSans-Regular",
    fontSize: normalize(baseVariants.headlineSmall.fontSize)
  },
  titleLarge: {
    ...baseVariants.titleLarge,
    fontFamily: "DMSans-Medium",
    fontSize: normalize(baseVariants.titleLarge.fontSize)
  },
  titleMedium: {
    ...baseVariants.titleMedium,
    fontFamily: "DMSans-Bold",
    fontSize: normalize(baseVariants.titleMedium.fontSize)
  },
  titleSmall: {
    ...baseVariants.titleSmall,
    fontFamily: "DMSans-Medium",
    fontSize: normalize(baseVariants.titleSmall.fontSize)
  },
  bodyLarge: {
    ...baseVariants.bodyLarge,
    fontFamily: "DMSans-Regular",
    fontSize: normalize(baseVariants.bodyLarge.fontSize)
  },
  bodyMedium: {
    ...baseVariants.bodyMedium,
    fontFamily: "DMSans-Regular",
    fontSize: normalize(baseVariants.bodyMedium.fontSize)
  },
  bodySmall: {
    ...baseVariants.bodySmall,
    fontFamily: "DMSans-Regular",
    fontSize: normalize(baseVariants.bodySmall.fontSize)
  },
  labelLargeProminent: {
    ...baseVariants.labelLarge,
    fontFamily: "DMSans-SemiBold",
    fontSize: normalize(baseVariants.labelLarge.fontSize)
  },
  labelLarge: {
    ...baseVariants.labelLarge,
    fontFamily: "DMSans-Medium",
    fontSize: normalize(baseVariants.labelLarge.fontSize)
  },
  labelMediumProminent: {
    ...baseVariants.labelMedium,
    fontFamily: "DMSans-SemiBold",
    fontSize: normalize(baseVariants.labelMedium.fontSize)
  },
  labelMedium: {
    ...baseVariants.labelMedium,
    fontFamily: "DMSans-SemiBold",
    fontSize: normalize(baseVariants.labelMedium.fontSize)
  },
  labelSmall: {
    ...baseVariants.labelSmall,
    fontFamily: "DMSans-Medium",
    fontSize: normalize(baseVariants.labelSmall.fontSize)
  },
};

// Finally, merge base variants with your custom tokens
// and apply custom fonts to your theme.
