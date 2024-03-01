export const useQuery: any = () => {
  const params = new URLSearchParams(window.location.search);
  const pathParams = {};

  params.forEach((value, key) => {
    pathParams[key] = value;
  });

  return pathParams;
};
