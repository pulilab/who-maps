export const loadHtmlTemplates = () => {
  return require.context('./Resource/template/', true, /\.html$/);
};
export const loadScorecardImages = () => {
  return require.context('./images/', true, /\.svg$/);
};
