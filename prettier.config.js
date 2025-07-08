export default {
  importOrderParserPlugins: ['importAssertions', 'typescript', 'jsx'],
  plugins: [
    '@prettier/plugin-oxc',
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-packagejson',
    'prettier-plugin-tailwindcss',
  ],
  singleQuote: true,
};
