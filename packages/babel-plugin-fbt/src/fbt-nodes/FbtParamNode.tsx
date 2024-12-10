import {
  arrayExpression,
  CallExpression,
  Expression,
  isCallExpression,
  isExpression,
  isStringLiteral,
  Node,
  numericLiteral,
  stringLiteral,
} from '@babel/types';
import invariant from 'invariant';
import nullthrows from 'nullthrows';
import { JSModuleNameType, ValidParamOptions } from '../FbtConstants';
import FbtNodeChecker from '../FbtNodeChecker';
import type {
  BabelNodeCallExpressionArgument,
  CallExpressionArg,
} from '../FbtUtil';
import {
  collectOptionsFromFbtConstruct,
  createFbtRuntimeArgCallExpression,
  errorAt,
  varDump,
} from '../FbtUtil';
import { GENDER_ANY, NUMBER_ANY } from '../translate/IntlVariations';
import type { StringVariationArgsMap } from './FbtArguments';
import {
  GenderStringVariationArg,
  NumberStringVariationArg,
} from './FbtArguments';
import FbtNode from './FbtNode';
import { FbtNodeType } from './FbtNodeType';
import { tokenNameToTextPattern } from './FbtNodeUtil';

type Options = {
  gender?: Expression | null | undefined; // Represents the `gender`,
  name: string; // Name of the string token,
  // If `true`, the string that uses this fbt:param will have number variations.
  // The `number` value will be inferred from the value of fbt:param
  // If `number` is a `BabelNode`, then we'll use it internally as the value to determine
  // the number variation, and the fbt:param value will represent the UI text to render.
  number?: true | null | undefined | Expression;
  value: BabelNodeCallExpressionArgument;
};

const ParamVariation = {
  gender: 1,
  number: 0,
} as const;

function enforceBabelNodeExpression(
  value: Node | string | null,
  valueDesc?: string | null
): Expression {
  invariant(
    value != null && typeof value !== 'string' && isExpression(value),
    '%sExpected BabelNodeExpression value instead of %s (%s)',
    valueDesc ? valueDesc + ' - ' : '',
    varDump(value),
    typeof value
  );
  return value;
}

/**
 * Represents an <fbt:param> or fbt.param() construct.
 * @see docs/params.md
 */
export default class FbtParamNode extends FbtNode<
  GenderStringVariationArg | NumberStringVariationArg,
  CallExpression,
  null,
  Options
> {
  static readonly type: FbtNodeType = FbtNodeType.Param;

  override getOptions(): Options {
    try {
      const rawOptions = collectOptionsFromFbtConstruct(
        this.moduleName,
        this.node,
        ValidParamOptions
      );
      const [arg0, arg1] = this.getCallNodeArguments() || [];
      const gender =
        rawOptions.gender != null && typeof rawOptions.gender !== 'boolean'
          ? enforceBabelNodeExpression(rawOptions.gender)
          : null;
      const number =
        typeof rawOptions.number === 'boolean'
          ? rawOptions.number
          : rawOptions.number != null
          ? enforceBabelNodeExpression(rawOptions.number)
          : null;

      invariant(
        number !== false,
        '`number` option must be an expression or `true`'
      );
      invariant(
        !gender || !number,
        'Gender and number options must not be set at the same time'
      );

      let name = typeof rawOptions.name === 'string' ? rawOptions.name : null;
      if (name == null || name === '') {
        invariant(
          isStringLiteral(arg0),
          'First function argument must be a string literal'
        );
        name = arg0.value;
      }
      invariant(name.length, 'Token name string must not be empty');

      const value = nullthrows(
        arg1,
        'The second function argument must not be null'
      );

      return {
        gender,
        name,
        number,
        value,
      };
    } catch (error: any) {
      throw errorAt(this.node, error);
    }
  }

  static fromBabelNode({
    moduleName,
    node,
  }: {
    moduleName: JSModuleNameType;
    node: Expression;
  }): FbtParamNode | null | undefined {
    if (!isCallExpression(node)) {
      return null;
    }

    const checker = FbtNodeChecker.forModule(moduleName);
    const constructName = checker.getFbtConstructNameFromFunctionCall(node);
    return constructName === FbtParamNode.type
      ? new FbtParamNode({
          moduleName,
          node,
        })
      : null;
  }

  override getArgsForStringVariationCalc(): ReadonlyArray<
    GenderStringVariationArg | NumberStringVariationArg
  > {
    const { gender, number } = this.options;
    const ret = [];
    invariant(
      !gender || !number,
      'Gender and number options must not be set at the same time'
    );
    if (gender) {
      ret.push(new GenderStringVariationArg(this, gender, [GENDER_ANY]));
    } else if (number) {
      ret.push(
        new NumberStringVariationArg(this, number === true ? null : number, [
          NUMBER_ANY,
        ])
      );
    }
    return ret;
  }

  override getTokenName(_argsMap: StringVariationArgsMap): string {
    return this.options.name;
  }

  override getText(argsMap: StringVariationArgsMap): string {
    try {
      this.getArgsForStringVariationCalc().forEach((expectedArg) => {
        const svArg = argsMap.get(this);
        invariant(
          svArg.constructor === expectedArg.constructor,
          'Expected SVArgument instance of %s but got %s instead: %s',
          expectedArg.constructor.name || 'unknown',
          svArg.constructor.name || 'unknown',
          varDump(svArg)
        );
      });
      return tokenNameToTextPattern(this.getTokenName(argsMap));
    } catch (error: any) {
      throw errorAt(this.node, error);
    }
  }

  override getFbtRuntimeArg(): CallExpression {
    const { gender, name, number, value } = this.options;
    let variationValues: Array<Expression> | null = null;

    if (number != null) {
      variationValues = [
        numericLiteral(ParamVariation.number),
      ] as Array<Expression>;
      if (number !== true) {
        // For number="true" we don't pass additional value.
        variationValues.push(number);
      }
    } else if (gender != null) {
      variationValues = [numericLiteral(ParamVariation.gender), gender];
    }
    return createFbtRuntimeArgCallExpression(
      this,
      [
        stringLiteral(name),
        value,
        variationValues ? arrayExpression(variationValues) : null,
      ].filter((node): node is Expression => node != null)
    );
  }

  override getArgsThatShouldNotContainFunctionCallOrClassInstantiation(): Readonly<{
    [argName: string]: CallExpressionArg;
  }> {
    const { gender, number } = this.options;
    if (gender != null) {
      return { gender };
    }
    return typeof number !== 'boolean' && isExpression(number)
      ? { number }
      : {};
  }
}