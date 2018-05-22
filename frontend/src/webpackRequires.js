export const loadHtmlTemplates = () => {
  return require.context('./MapsToolkit/Resource/template/', true, /\.html$/);
};
export const loadScorecardImages = () => {
  return require.context('./MapsToolkit/Scorecard/images/', true, /\.svg$/);
};

export const loadSkeletonImages = () => {
  return require.context('./Common/Thematic/images/', true, /\.svg$/);
};
export const loadSkeletonStatic = () => {
  return require.context('./Common/Thematic/static/', true, /\.html$/);
};
