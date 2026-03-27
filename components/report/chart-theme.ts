// Chart color palette matching site theme
// Background: rgb(31,31,36), Accent: rgb(115,55,225)

export const CHART_COLORS = [
  "rgb(115, 55, 225)",  // primary purple
  "rgb(90, 125, 154)",  // steel blue
  "rgb(0, 115, 206)",   // bright blue
  "rgb(139, 51, 255)",  // light purple
  "rgb(167, 167, 167)", // warm gray
  "rgb(68, 68, 68)",    // dark gray
] as const;

export const CHART_COLORS_EXTENDED = [
  "rgb(115, 55, 225)",
  "rgb(0, 115, 206)",
  "rgb(90, 125, 154)",
  "rgb(139, 51, 255)",
  "rgb(167, 167, 167)",
  "rgb(68, 68, 68)",
  "rgb(75, 140, 190)",
  "rgb(150, 90, 240)",
  "rgb(130, 130, 130)",
  "rgb(55, 55, 65)",
  "rgb(100, 160, 210)",
] as const;

export const DUAL_COLORS = {
  italian: "rgb(115, 55, 225)",
  italianAmerican: "rgb(90, 125, 154)",
} as const;
