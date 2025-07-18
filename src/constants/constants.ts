export const yesNoChoices = [
  { label: 'Yes', value: true },
  { label: 'No', value: false }
];

export type YesNoValue = (typeof yesNoChoices)[number]['value'];

export const countries = [
  { label: "🇩🇪 Germany", value: "de" },
  { label: "🇫🇷 France", value: "fr" },
  { label: "🇵🇱 Poland", value: "pl" },
  { label: "🇮🇹 Italy", value: "it" },
  { label: "🇳🇱 Netherlands", value: "nl" },
  { label: "🇧🇪 Belgium", value: "be" },
  { label: "🇦🇹 Austria", value: "at" },
  { label: "🇨🇭 Switzerland", value: "ch" },
  { label: "🇪🇸 Spain", value: "es" }
];

export type CountryValue = (typeof countries)[number]['value'];

export const variationsOptions = [
  { label: 'One', value: 1 },
  { label: 'Two', value: 2 },
  { label: 'Three', value: 3 },
  { label: 'Four', value: 4 }
];

export type VariationsValue = (typeof variationsOptions)[number]['value'];
