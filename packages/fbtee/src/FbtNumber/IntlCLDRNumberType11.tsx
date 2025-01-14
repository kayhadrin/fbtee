import IntlVariations from '../IntlVariations.tsx';

const IntlCLDRNumberType11 = {
  getVariation(n: number): IntlVariations {
    return n % 10 === 1 && n % 100 !== 11
      ? IntlVariations.NUMBER_ONE
      : IntlVariations.NUMBER_OTHER;
  },
} as const;

export default IntlCLDRNumberType11;
