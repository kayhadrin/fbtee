import { describe, expect } from '@jest/globals';
import { jsCodeFbtCallSerializer, snapshotTransform } from './FbtTestUtil.tsx';

expect.addSnapshotSerializer(jsCodeFbtCallSerializer);

describe('Fbt React Component transform:', () => {
  test('supports simple <Fbt> string', () => {
    expect(
      snapshotTransform(
        `import { Fbt } from "Fbtee.react";
        <Fbt desc="some-desc">
          A simple string
        </Fbt>`,
      ),
    ).toMatchSnapshot();
  });
});
