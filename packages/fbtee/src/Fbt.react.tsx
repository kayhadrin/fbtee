import { ComponentType, PropsWithChildren, ReactNode } from 'react';
import {
  FbtEnumProps,
  FbtListProps,
  FbtNameProps,
  FbtParamProps,
  FbtPluralProps,
  FbtPronounProps,
  FbtProps,
  FbtSameParamProps,
} from '../ReactTypes.js';
import fbtRuntime from './fbt.tsx';
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
}): ReactNode {
  return (
    <>
      {typeof fromFbt === 'string'
        ? fromFbt
        : (fromFbt.getContents() as ReactNode)}
    </>
  );
}

function throwMissingFbtTransformError() {
  throw new Error(
    `fbt must be used with its corresponding babel plugin. Please install the babel plugin and try again.`,
  );
}
// Attach the runtime to the user-facing Fbt component for use after transpilation.
throwMissingFbtTransformError._ = fbtRuntime;
// Attach the internal React runtime component to the user-facing Fbt component for use after transpilation.
throwMissingFbtTransformError._$ = fbtRuntime;

export const Fbt = throwMissingFbtTransformError as ComponentType<FbtProps>;

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
