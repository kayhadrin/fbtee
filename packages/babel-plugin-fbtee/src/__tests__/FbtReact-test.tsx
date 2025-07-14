import { expect } from '@jest/globals';
import {
  jsCodeFbtCallSerializer,
  snapshotTransform,
  withFbtImportStatement,
} from './FbtTestUtil.tsx';

expect.addSnapshotSerializer(jsCodeFbtCallSerializer);

function withFbtReactImportStatement(code: string): string {
  return `import { Fbt } from "Fbtee.react";
  ${code}`;
}

fdescribe('Fbt React Component transform:', () => {
  test('supports simple <Fbt> string', () => {
    expect(
      snapshotTransform(
        withFbtReactImportStatement(
          `<Fbt desc="desc">
            A simple string
          </Fbt>`,
        ),
      ),
    ).toMatchSnapshot();
  });

  test('supports React component and legacy JSX notations at the same time', () => {
    expect(
      snapshotTransform(
        // import fbt before Fbt react component
        withFbtImportStatement(
          withFbtReactImportStatement(
            `<fbt desc="desc">
              String with regular fbt syntax
            </fbt>;

            <Fbt desc="desc">
              String with fbt react component syntax
            </Fbt>;`,
          ),
        ),
      ),
    ).toMatchSnapshot();

    expect(
      snapshotTransform(
        // import Fbt react component before fbt
        withFbtReactImportStatement(
          withFbtImportStatement(
            `<fbt desc="desc">
              String with regular fbt syntax
            </fbt>;

            <Fbt desc="desc">
              String with fbt react component syntax
            </Fbt>;`,
          ),
        ),
      ),
    ).toMatchSnapshot();
  });

  test('supports <FbtParam> construct', () => {
    expect(
      snapshotTransform(
        withFbtReactImportStatement(
          `<Fbt desc="desc">
            a string
            <FbtParam name="tokenName">
              {tokenValue}
            </FbtParam>
          </Fbt>`,
        ),
      ),
    ).toMatchSnapshot();
  });

  test('supports nested <Fbt> strings within <FbtParam>', () => {
    expect(
      snapshotTransform(
        withFbtReactImportStatement(
          `<Fbt desc="outer desc">
            an outer Fbt string
            <FbtParam name="outerTokenName">
              {
                <Fbt desc="inner desc">
                  an inner Fbt string
                  <FbtParam name="innerTokenName">
                    {innerTokenValue}
                  </FbtParam>
                </Fbt>
              }
            </FbtParam>
          </Fbt>`,
        ),
      ),
    ).toMatchSnapshot();
  });
});
