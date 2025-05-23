import IntlVariations from '../IntlVariations.tsx';

export default {
  getVariation(n: number): IntlVariations {
    return n === 1 ||
      n === 2 ||
      n === 3 ||
      (n % 10 !== 4 && n % 10 !== 6 && n % 10 !== 9)
      ? IntlVariations.NUMBER_ONE
      : IntlVariations.NUMBER_OTHER;
  },
};
