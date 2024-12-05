import type {IntlVariationsEnum} from '../IntlVariations';

export default {
  getNumberVariations(): Array<IntlVariationsEnum> {
    return [4, 8, 20, 24];
  },

  getFallback(): IntlVariationsEnum {
    return 24;
  },
};
