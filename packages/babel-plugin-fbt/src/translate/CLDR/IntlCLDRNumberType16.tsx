import type {IntlVariationsEnum} from '../IntlVariations';

export default {
  getFallback(): IntlVariationsEnum {
    return 24;
  },

  getNumberVariations(): Array<IntlVariationsEnum> {
    return [16, 4, 24];
  },
};