import { afterEach, describe, it, jest } from '@jest/globals';
import { jsCodeNonASCIICharSerializer } from '../../__tests__/FbtTestUtil.tsx';
import { Options, processJSON } from '../translateUtils.tsx';

expect.addSnapshotSerializer(jsCodeNonASCIICharSerializer);

const consoleError = console.error;

afterEach(() => {
  console.error = consoleError;
});

function testTranslateNewPhrases(options: Options) {
  it('should not throw on missing translations', async () => {
    console.error = jest.fn();
    const result = await processJSON(
      {
        phrases: [
          {
            filename: 'src/example/Example.react.js',
            hashToLeaf: {
              '2dcba29d4a842c6be5d76fe996fcd9f4': {
                desc: 'title',
                text: 'Your FBT Demo',
              },
            },
            jsfbt: {
              m: [],
              t: {
                desc: 'title',
                text: 'Your FBT Demo',
                tokenAliases: {},
              },
            },
            loc: {
              end: {
                column: 49,
                line: 130,
              },
              start: {
                column: 12,
                line: 130,
              },
            },
            project: 'fbt-demo-project',
          },
        ],
        translationGroups: [
          {
            'fb-locale': 'fb_HX',
            translations: {
              '2dcba29d4a842c6be5d76fe996fcd9f4': null,
            },
          },
        ],
      },
      options,
    );
    expect(result).toMatchSnapshot();
    expect(console.error).toHaveBeenCalled();
  });

  it('should translate string with no variation', async () => {
    const result = await processJSON(
      {
        phrases: [
          {
            filename: 'src/example/Example.react.js',
            hashToLeaf: {
              '2dcba29d4a842c6be5d76fe996fcd9f4': {
                desc: 'title',
                text: 'Your FBT Demo',
              },
            },
            jsfbt: {
              m: [],
              t: {
                desc: 'title',
                text: 'Your FBT Demo',
                tokenAliases: {},
              },
            },
            loc: {
              end: {
                column: 49,
                line: 130,
              },
              start: {
                column: 12,
                line: 130,
              },
            },
            project: 'fbt-demo-project',
          },
        ],
        translationGroups: [
          {
            'fb-locale': 'fb_HX',
            translations: {
              '2dcba29d4a842c6be5d76fe996fcd9f4': {
                tokens: [],
                translations: [
                  {
                    translation: 'Translation data for Your FBT Demo',
                    variations: {},
                  },
                ],
                types: [],
              },
            },
          },
        ],
      },
      options,
    );
    expect(result).toMatchSnapshot();
  });

  it('should translate string with variations and inner strings', async () => {
    const result = await processJSON(
      {
        phrases: [
          {
            filename: 'src/example/Example.react.js',
            hashToLeaf: {
              'gVKMc/8jq5vnYR5v2bb32g==': {
                desc: 'example 1',
                text: '{name} has shared {=[number] photos} with you. View =[number] photos',
              },
              'PqPPir8Kg9xSlqdednPFOg==': {
                desc: 'example 1',
                text: '{name} has shared {=a photo} with you. View a photo',
              },
            },
            jsfbt: {
              m: [
                {
                  token: 'name',
                  type: 1,
                },
                {
                  singular: true,
                  token: 'number',
                  type: 2,
                },
              ],
              t: {
                '*': {
                  _1: {
                    desc: 'example 1',
                    text: '{name} has shared {=a photo} with you. View a photo',
                    tokenAliases: {
                      '=a photo': '=m2',
                    },
                  },
                  '*': {
                    desc: 'example 1',
                    text: '{name} has shared {=[number] photos} with you. View =[number] photos',
                    tokenAliases: {
                      '=[number] photos': '=m2',
                    },
                  },
                },
              },
            },
            loc: {
              end: {
                column: 14,
                line: 142,
              },
              start: {
                column: 8,
                line: 127,
              },
            },
            project: 'fbt-demo-project',
          },
          {
            filename: 'src/example/Example.react.js',

            hashToLeaf: {
              '/gj3gwqx1z8Xw233oZgOpQ==': {
                desc: 'In the phrase: "{name} has shared {=[number] photos} with you. View =[number] photos"',
                text: '{number} photos',
              },
              '8UZCD6gFUKN+U5UUo1I3/w==': {
                desc: 'In the phrase: "{name} has shared {=a photo} with you. View a photo"',
                text: 'a photo',
              },
            },
            jsfbt: {
              m: [
                {
                  token: 'name',
                  type: 1,
                },
                {
                  singular: true,
                  token: 'number',
                  type: 2,
                },
              ],
              t: {
                '*': {
                  _1: {
                    desc: 'In the phrase: "{name} has shared {=a photo} with you. View a photo"',
                    text: 'a photo',
                    tokenAliases: {},
                  },
                  '*': {
                    desc: 'In the phrase: "{name} has shared {=[number] photos} with you. View =[number] photos"',
                    text: '{number} photos',
                    tokenAliases: {},
                  },
                },
              },
            },
            loc: {
              end: {
                column: 14,
                line: 140,
              },
              start: {
                column: 10,
                line: 133,
              },
            },
            project: 'fbt-demo-project',
          },
        ],
        translationGroups: [
          {
            'fb-locale': 'fb_HX',
            translations: {
              '/gj3gwqx1z8Xw233oZgOpQ==': {
                tokens: [],
                translations: [
                  {
                    id: 107_911_344,
                    translation: 'translation is: {number} photos',
                    variations: {},
                  },
                ],
                types: [],
              },
              '8UZCD6gFUKN+U5UUo1I3/w==': {
                tokens: [],
                translations: [
                  {
                    id: 107_911_340,
                    translation: 'translation is: a photo',
                    variations: {},
                  },
                ],
                types: [],
              },
              'gVKMc/8jq5vnYR5v2bb32g==': {
                tokens: ['name'],
                translations: [
                  {
                    id: 108_537_963,
                    translation:
                      'translation is: {name} has shared {=[number] photos}. View =[number] photos',
                    variations: { '0': 2 },
                  },
                  {
                    id: 108_537_953,
                    translation:
                      'translation is: {name} has shared {=[number] photos}. View =[number] photos',
                    variations: { '0': 1 },
                  },
                  {
                    id: 108_537_972,
                    translation:
                      'translation is: {name} has shared {=[number] photos}. View =[number] photos',
                    variations: { '0': 3 },
                  },
                ],
                types: [3],
              },
              'PqPPir8Kg9xSlqdednPFOg==': {
                tokens: ['name'],
                translations: [
                  {
                    id: 108_537_963,
                    translation:
                      'translation is: {name} has shared {=a photo}. View a photo',
                    variations: { '0': 2 },
                  },
                  {
                    id: 108_537_953,
                    translation:
                      'translation is: {name} has shared {=a photo}. View a photo',
                    variations: { '0': 1 },
                  },
                  {
                    id: 108_537_972,
                    translation:
                      'translation is: {name} has shared {=a photo}. View a photo',
                    variations: { '0': 3 },
                  },
                ],
                types: [3],
              },
            },
          },
        ],
      },
      options,
    );
    expect(result).toMatchSnapshot();
  });

  it('should translate string with metadata entries that create no hidden variation. Note: this string was collected in RN mode.', async () => {
    const result = await processJSON(
      {
        phrases: [
          {
            filename: 'src/example/Example.react.js',
            hashToLeaf: {
              'j9fTl1uOEIuslim41sMkdQ==': {
                desc: 'Example enum',
                text: 'he shared a photo.',
              },
              'sNncqVnQfCGCeJNXsLObVw==': {
                desc: 'Example enum',
                text: 'they shared a photo.',
              },
              'vHtEb4ph7GJGeRkjtEHcPA==': {
                desc: 'Example enum',
                text: 'she shared a photo.',
              },
            },
            jsfbt: {
              m: [
                {
                  type: 3,
                },
              ],
              t: {
                '*': {
                  desc: 'Example enum',
                  text: 'they shared a photo.',
                },
                '1': {
                  desc: 'Example enum',
                  text: 'she shared a photo.',
                },
                '2': {
                  desc: 'Example enum',
                  text: 'he shared a photo.',
                },
              },
            },
            loc: {
              end: {
                column: 14,
                line: 130,
              },
              start: {
                column: 6,
                line: 127,
              },
            },
            project: 'fbt-demo-project',
          },
        ],
        translationGroups: [
          {
            'fb-locale': 'fb_HX',
            translations: {
              'j9fTl1uOEIuslim41sMkdQ==': {
                tokens: [],
                translations: [
                  {
                    translation: 'translation is: he shared a photo',
                    variations: {},
                  },
                ],
                types: [],
              },
              'sNncqVnQfCGCeJNXsLObVw==': {
                tokens: [],
                translations: [
                  {
                    translation: 'translation is: they shared a photo',
                    variations: {},
                  },
                ],
                types: [],
              },
              'vHtEb4ph7GJGeRkjtEHcPA==': {
                tokens: [],
                translations: [
                  {
                    translation: 'translation is: she shared a photo',
                    variations: {},
                  },
                ],
                types: [],
              },
            },
          },
        ],
      },
      options,
    );
    expect(result).toMatchSnapshot();
  });

  it('should translate string with enum', async () => {
    const result = await processJSON(
      {
        phrases: [
          {
            filename: 'src/example/Example.react.js',
            hashToLeaf: {
              '/3R5GnCZ5eU3EgRAiLf1vA==': {
                desc: 'Example enum',
                text: '{name} has a photo to share! View photo.',
              },
              '/giEGYE5cqdJVvtszgdPLg==': {
                desc: 'Example enum',
                text: '{name} has a video to share! View video.',
              },
              '2PhpGvvUtmT5RTpv8Kqf0w==': {
                desc: 'Example enum',
                text: '{name} has a link to share! View link.',
              },
              'nwcWZzo5dAQX38+P1IaY6A==': {
                desc: 'Example enum',
                text: '{name} has a page to share! View page.',
              },
              'wGYWno21D5FWihP/v0boFw==': {
                desc: 'Example enum',
                text: '{name} has a post to share! View post.',
              },
            },
            jsfbt: {
              m: [null],
              t: {
                LINK: {
                  desc: 'Example enum',
                  text: '{name} has a link to share! View link.',
                },
                PAGE: {
                  desc: 'Example enum',
                  text: '{name} has a page to share! View page.',
                },
                PHOTO: {
                  desc: 'Example enum',
                  text: '{name} has a photo to share! View photo.',
                },
                POST: {
                  desc: 'Example enum',
                  text: '{name} has a post to share! View post.',
                },
                VIDEO: {
                  desc: 'Example enum',
                  text: '{name} has a video to share! View video.',
                },
              },
            },
            loc: {
              end: {
                column: 12,
                line: 133,
              },
              start: {
                column: 6,
                line: 127,
              },
            },
            project: 'fbt-demo-project',
          },
        ],
        translationGroups: [
          {
            'fb-locale': 'fb_HX',
            translations: {
              '/3R5GnCZ5eU3EgRAiLf1vA==': {
                tokens: [],
                translations: [
                  {
                    translation: 'translation is: {name} has a photo to share',
                    variations: {},
                  },
                ],
                types: [],
              },
              '/giEGYE5cqdJVvtszgdPLg==': {
                tokens: [],
                translations: [
                  {
                    translation: 'translation is: {name} has a video to share',
                    variations: {},
                  },
                ],
                types: [],
              },
              '2PhpGvvUtmT5RTpv8Kqf0w==': {
                tokens: [],
                translations: [
                  {
                    translation: 'translation is: {name} has a link to share',
                    variations: {},
                  },
                ],
                types: [],
              },
              'nwcWZzo5dAQX38+P1IaY6A==': {
                tokens: [],
                translations: [
                  {
                    translation: 'translation is: {name} has a page to share',
                    variations: {},
                  },
                ],
                types: [],
              },
              'wGYWno21D5FWihP/v0boFw==': {
                tokens: [],
                translations: [
                  {
                    translation: 'translation is: {name} has a post to share',
                    variations: {},
                  },
                ],
                types: [],
              },
            },
          },
        ],
      },
      options,
    );
    expect(result).toMatchSnapshot();
  });
}

describe('translate-test.js', () => {
  describe('should translate new jsfbt payload', () => {
    for (const options of [
      { hashModule: false, jenkins: false, strict: false } as const,
    ]) {
      describe(`with option=${JSON.stringify(options)}:`, () => {
        testTranslateNewPhrases(options);
      });
    }
  });
});
