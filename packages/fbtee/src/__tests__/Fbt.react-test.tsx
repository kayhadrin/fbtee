/// <reference types="../../ReactTypes.d.ts" />

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import { Component } from 'react';
import fbtInternal from '../fbt.tsx';
import FbtTranslations from '../FbtTranslations.tsx';
import GenderConst from '../GenderConst.tsx';
import Hooks, { FbtRuntimeCallInput, FbtTranslatedInput } from '../Hooks.tsx';
import { fbt } from '../index.tsx';
import IntlVariations from '../IntlVariations.tsx';
import setupFbtee, { defaultGetFbtResult } from '../setupFbtee.tsx';
import { FbtImpl, Fbt as FbtPublicReactComponent } from '../Fbt.react.tsx';

function toHTML(arg: React.ReactNode): string {
  return render(arg).container.innerHTML;
}

setupFbtee({
  translations: { en_US: {} },
});

const consoleError = console.error;
afterEach(() => {
  console.error = consoleError;
});

describe('Fbt React Component:', () => {
  fdescribe('accessed directly:', () => {
    beforeEach(() => {
      Hooks.register({
        getFbtResult: defaultGetFbtResult,
        getTranslatedInput: FbtTranslations.getTranslatedInput,
      });
    });

    fit('should hint at the correct usage of fbt', () => {
      expect(() =>
        // @ts-expect-error: voluntarily call the Fbt react component as a function
        FbtPublicReactComponent('test'),
      ).toThrowErrorMatchingInlineSnapshot(
        `"fbt must be used with its corresponding babel plugin. Please install the babel plugin and try again."`,
      );
    });

    fit('should trivially handle tokenless strings', () => {
      expect(
        toHTML(<FbtImpl _={fbt('without tokens', 'test')} />),
      ).toMatchInlineSnapshot(`"without tokens"`);
    });

    fit('should handle common strings', () => {
      expect(toHTML(<FbtImpl _={fbt.c('Accept')} />)).toEqual(
        toHTML(<FbtImpl _={fbt('Accept', 'Button/Link: Accept conditions')} />),
      );
    });

    fit('should replace tokens with named values', () => {
      expect(
        toHTML(
          <FbtImpl
            _={fbt(
              'with single token ' + fbt.param('token', 'A') + ' here',
              'test',
            )}
          />,
        ),
      ).toMatchInlineSnapshot(`"with single token A here"`);

      expect(
        toHTML(
          <FbtImpl
            _={fbt(
              'with tokens ' +
                fbt.param('tokenA', 'A') +
                ' and ' +
                fbt.param('tokenB', 'B') +
                '',
              'test',
            )}
          />,
        ),
      ).toMatchInlineSnapshot(`"with tokens A and B"`);
    });
  });

  fit('should support nested objects as token values', () => {
    expect(
      toHTML(
        <FbtImpl
          _={fbt(
            'with token ' + fbt.param('token', <span>value</span>) + ' here',
            'test',
          )}
        />,
      ),
    ).toMatchInlineSnapshot(`"with token <span>value</span> here"`);
  });

  /////////////////////////////////////////////////////////////////////////
  // TODO: make e2e tests once the babel transform support is implemented
  /////////////////////////////////////////////////////////////////////////

  // React/fbt integration tests
  type Props = Readonly<{
    childA: React.ReactNode;
    childB: React.ReactNode;
    value: string;
  }>;

  function _render(
    value: string,
    childA: React.ReactNode,
    childB: React.ReactNode,
  ) {
    // In theory, different enum values can result in different sentence
    // structures. If that happens, the React components should retain
    // their state even though they change order. We mock out a fake
    // string table to test this special case.
    const fbtFragment = fbtInternal._(
      {
        A: 'preamble {tokenA} is before {tokenB}',
        B: 'preamble {tokenB} is after {tokenA}',
      },
      [
        fbtInternal._param('tokenA', childA as string),
        fbtInternal._param('tokenB', childB as string),
        fbtInternal._enum(value, { A: 'is before', B: 'is after' }),
      ],
    );
    // @ts-expect-error
    return <div>{fbtFragment}</div>;
  }

  class TestComponent extends Component<Props> {
    override render() {
      return _render(this.props.value, this.props.childA, this.props.childB);
    }
  }

  it('should use wildcard defaults', () => {
    expect(
      fbt(
        'with something like ' +
          fbt.param('count', 42, { number: true }) +
          ' wildcards',
        'test',
      ),
    ).toEqual('with something like 42 wildcards');
  });

  it('should format numeric value', () => {
    expect(
      fbt(
        'A total amount is ' + fbt.param('count', 10_000, { number: true }),
        'Test string',
      ),
    ).toEqual('A total amount is 10,000');
  });

  it('should keep literal value as is', () => {
    expect(
      fbt('A total amount is ' + fbt.param('count', 10_000), 'Test string'),
    ).toEqual('A total amount is 10000');
  });

  it('should not warn when unkeyed React components are params', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <TestComponent childA={<div />} childB={<div />} value="A" />,
    );
    expect(container.children[0].getElementsByTagName('div').length).toBe(2);
    expect(warn.mock.calls.length).toBe(0);
  });

  function expectChildSetsToRetainIdentity(
    setA: React.ReactElement,
    setB: React.ReactElement,
  ) {
    const { container: containerA } = render(
      <TestComponent childA={setA} childB={setB} value="A" />,
    );
    const nodeA = containerA.children[0];
    const { container: containerB } = render(
      <TestComponent childA={setA} childB={setB} value="B" />,
    );
    const nodeB = containerB.children[0];

    expect(nodeA.getElementsByTagName('div').length).toBe(2);
    expect(nodeB.getElementsByTagName('div').length).toBe(2);

    // Expect the child nodes be the same instances as before, only reordered.
    expect(nodeA.children[0].innerHTML).toBe(nodeB.children[1].innerHTML);
    expect(nodeA.children[1].innerHTML).toBe(nodeB.children[0].innerHTML);
  }

  it('should retain React identity when sentence order changes', () => {
    expectChildSetsToRetainIdentity(<div key="A" />, <div key="B" />);
  });

  describe('when encountering duplicate token substitutions', () => {
    it('should log the duplicate token coming from the same type of construct', () => {
      expect(() =>
        fbtInternal._('Just a {tokenName}', [
          fbtInternal._param('tokenName', 'substitute'),
          fbtInternal._param('tokenName', 'substitute'),
        ]),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Cannot register a substitution with token=\`tokenName\` more than once"`,
      );
    });

    it('should log the duplicate token coming from the different constructs', () => {
      expect(() =>
        fbtInternal._('Just a {tokenName}', [
          fbtInternal._param('tokenName', 'substitute'),
          fbtInternal._name(
            'tokenName',
            'person name',
            GenderConst.UNKNOWN_SINGULAR,
          ),
        ]),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Cannot register a substitution with token=\`tokenName\` more than once"`,
      );
    });
  });

  it('should create a tuple for fbt.subject if valid', () => {
    expect(fbtInternal._subject(GenderConst.MALE_SINGULAR)).toEqual([
      [GenderConst.MALE_SINGULAR, '*'],
      null,
    ]);
    expect(() => fbtInternal._subject(0)).toThrow('Invalid gender provided');
  });

  it('should leave non-QuickTranslation strings alone', () => {
    expect(
      fbtInternal._(["This isn't", '8b0c31a270a324f26d2417a358106612']),
    ).toEqual("This isn't");
  });

  it('should access table with multiple tokens containing subject', () => {
    expect(
      fbt(
        'Invited by ' + fbt.plural('friend', 1, { showCount: 'yes' }) + '.',
        'Test Description',
        { subject: IntlVariations.GENDER_UNKNOWN },
      ),
    ).toEqual('Invited by 1 friend.');
  });

  it('should defer to Hooks.getTranslatedInput', () => {
    Hooks.register({
      getTranslatedInput(_input: FbtRuntimeCallInput): FbtTranslatedInput {
        return { args: null, table: 'ALL YOUR TRANSLATION ARE BELONG TO US' };
      },
    });
    expect(fbtInternal._('sample string', null, null)).toEqual(
      'ALL YOUR TRANSLATION ARE BELONG TO US',
    );
  });

  describe('given a string that is only made of contiguous tokens', () => {
    it('should return a list of token values without empty strings', () => {
      const fbtParams = ['hello', 'world'];

      expect(
        <fbt desc="...">
          <fbt:param name="hello">{fbtParams[0]}</fbt:param>
          <fbt:param name="world">{fbtParams[1]}</fbt:param>
        </fbt>,
      ).toEqual(fbtParams.join(''));

      expect(
        fbt(
          fbt.param('hello', fbtParams[0]) + fbt.param('world', fbtParams[1]),
          'desc',
        ),
      ).toEqual(fbtParams.join(''));
    });
  });

  describe(': given a string with implicit parameters', () => {
    function getFbt({
      count,
      object,
      ownerGender,
      viewer,
    }: Readonly<{
      count: number;
      object: string;
      ownerGender:
        | 'FEMALE_SINGULAR'
        | 'MALE_SINGULAR'
        | 'NOT_A_PERSON'
        | 'UNKNOWN_PLURAL'
        | 'UNKNOWN_SINGULAR';
      viewer: {
        gender: IntlVariations;
        name: string;
      };
    }>) {
      return (
        <fbt desc="description">
          <fbt:name gender={viewer.gender} name="name">
            {viewer.name}
          </fbt:name>
          clicked on
          <strong>
            <fbt:pronoun gender={GenderConst[ownerGender]} type="possessive" />
            <a href="#link">
              <fbt:enum
                enum-range={{
                  comment: 'comment',
                  photo: 'photo',
                }}
                value={object}
              />
            </a>
          </strong>{' '}
          <em>
            <fbt:plural count={count} showCount="yes">
              time
            </fbt:plural>
          </em>
        </fbt>
      );
    }

    // DEBUG: show the babel-plugin-fbt transform output
    // console.warn('getFbt = \n----\n%s\n----\n', getFbt + '');

    const combinations: {
      counts: Array<number>;
      objects: Array<'photo' | 'comment'>;
      ownerGenders: Array<keyof typeof GenderConst>;
      viewers: Array<{
        gender: IntlVariations;
        name: string;
      }>;
    } = {
      counts: [1, 10],
      objects: ['photo', 'comment'],
      ownerGenders: ['FEMALE_SINGULAR', 'MALE_SINGULAR', 'UNKNOWN_PLURAL'],
      viewers: [
        {
          gender: IntlVariations.GENDER_MALE,
          name: 'Bob',
        },
        {
          gender: IntlVariations.GENDER_FEMALE,
          name: 'Betty',
        },
        {
          gender: IntlVariations.GENDER_UNKNOWN,
          name: 'Kim',
        },
      ],
    };

    combinations.viewers.forEach((viewer) =>
      combinations.ownerGenders.forEach((ownerGender) =>
        combinations.objects.forEach((object) =>
          combinations.counts.forEach((count) =>
            describe(`where viewer=${viewer.name}, ownerGender=${ownerGender}, object=${object}, count=${count}\n`, () =>
              it(`should produce proper nested fbt results`, () => {
                expect(
                  getFbt({
                    count,
                    object,
                    ownerGender,
                    viewer,
                  }),
                ).toMatchSnapshot();
              })),
          ),
        ),
      ),
    );
  });
});

test('ensure unique keys for React elements', () => {
  console.error = jest.fn();

  const { asFragment } = render(
    <span>
      <fbt desc="Test description.">
        <fbt:param name="hello">
          <div>Apple</div>
        </fbt:param>
        <fbt:param name="world">
          <div>Banana</div>
        </fbt:param>
      </fbt>
    </span>,
  );

  expect(console.error).not.toHaveBeenCalled();

  expect(asFragment()).toMatchSnapshot();
});
