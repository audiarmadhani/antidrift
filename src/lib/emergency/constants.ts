export const EMERGENCY_EMOTIONS = [
  "Bored",
  "Lonely",
  "Stressed",
  "Rejected",
  "Angry",
  "Tired",
  "Anxious",
  "Empty",
  "Other",
] as const;

export const PREDICTED_FEELINGS = [
  "Relief",
  "Pride",
  "Guilt",
  "Shame",
  "Emptiness",
  "Regret",
] as const;

export const EMERGENCY_ALTERNATIVES = [
  { label: "Go for a walk", href: null },
  { label: "Hit golf balls", href: null },
  { label: "Journal", href: "/journal" },
  { label: "Build something", href: "/goals" },
  { label: "Call wife", href: null },
  { label: "Exercise", href: null },
  { label: "Apply for jobs", href: "/goals" },
] as const;

export const IDENTITY_BULLETS = [
  "Multiple businesses",
  "Safe marriage",
  "One child",
  "Scratch golfer",
  "Wealth",
  "Health",
  "Builder",
] as const;

export const FRICTION_DURATION_SECONDS = 600;
