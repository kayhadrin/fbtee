import { ComponentType } from 'react';
import { FbsNameProps, FbsParamProps, FbsPluralProps } from '../ReactTypes.js';
import { FbtName, FbtParam, FbtPlural } from './Fbt.react.js';

export {
  /**
   * @private
   */
  FbtImpl,
  Fbt as Fbs,
  FbtEnum as FbsEnum,
  FbtPronoun as FbsPronoun,
  FbtSameParam as FbsSameParam,
} from './Fbt.react.js';

export const FbsName = FbtName as ComponentType<FbsNameProps>;

export const FbsParam = FbtParam as ComponentType<FbsParamProps>;

export const FbsPlural = FbtPlural as ComponentType<FbsPluralProps>;
