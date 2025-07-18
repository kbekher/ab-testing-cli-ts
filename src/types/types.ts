import { CountryValue, VariationsValue, YesNoValue } from "../constants/constants.js";

export interface CreateCommandInput {
  ticket: string;
  name: string;
  country: CountryValue;
  isNewControl: YesNoValue;
  variations: VariationsValue;
  global: YesNoValue;
  addGoals: YesNoValue;
  goals?: string[] | false;
}

export type StepKey = keyof CreateCommandInput | 'done';