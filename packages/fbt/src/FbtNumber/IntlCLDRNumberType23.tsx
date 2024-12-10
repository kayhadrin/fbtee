import IntlVariations from '../IntlVariations.tsx';

const IntlCLDRNumberType23 = {
  getVariation(n: number): IntlVariations {
    if (n % 100 === 1) {
      return IntlVariations.NUMBER_ONE;
    } else if (n % 100 === 2) {
      return IntlVariations.NUMBER_TWO;
    } else if (n % 100 >= 3 && n % 100 <= 4) {
      return IntlVariations.NUMBER_FEW;
    } else {
      return IntlVariations.NUMBER_OTHER;
    }
  },
} as const;

export default IntlCLDRNumberType23;
