import { ComponentType, PropsWithChildren } from 'react';
import {
  FbtEnumProps,
  FbtListProps,
  FbtNameProps,
  FbtParamProps,
  FbtPluralProps,
  FbtPronounProps,
  FbtSameParamProps,
} from '../ReactTypes.js';
import { BaseResult, TranslatedString } from './Types.ts';

/**
 * Do NOT use it in your "user" code!
 * Internal implementation of the Fbt React component.
 * @private
 */
export function FbtImpl({
  _: fromFbt,
}: {
  /**
   * fbt result to render
   */
  _: BaseResult | TranslatedString;
}): React.ReactNode {
  return <>{typeof fromFbt === 'string' ? fromFbt : fromFbt.getContents()}</>;
}

function throwMissingFbtTransformError() {
  throw new Error(
    `fbt must be used with its corresponding babel plugin. Please install the babel plugin and try again.`,
  );
}

export const Fbt = throwMissingFbtTransformError as ComponentType<FbtEnumProps>;

export const FbtEnum =
  throwMissingFbtTransformError as ComponentType<FbtEnumProps>;

export const FbtList =
  throwMissingFbtTransformError as ComponentType<FbtListProps>;

export const FbtName = throwMissingFbtTransformError as ComponentType<
  PropsWithChildren<FbtNameProps>
>;

export const FbtParam = throwMissingFbtTransformError as ComponentType<
  PropsWithChildren<FbtParamProps>
>;

export const FbtPlural = throwMissingFbtTransformError as ComponentType<
  PropsWithChildren<FbtPluralProps>
>;

export const FbtPronoun =
  throwMissingFbtTransformError as ComponentType<FbtPronounProps>;

export const FbtSameParam =
  throwMissingFbtTransformError as ComponentType<FbtSameParamProps>;
