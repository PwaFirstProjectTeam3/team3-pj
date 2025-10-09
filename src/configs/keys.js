export const SERVICES = {
  SEARCH_STN_BY_LINE: "SearchSTNBySubwayLineInfo",
};

const normalizeLine = (lineNum) => {
  const m = String(lineNum).match(/^([1-9])\s*호선$/);
  return m ? `0${m[1]}호선` : String(lineNum).trim();
};

export const ENDPOINTS = {
  searchStnByLinePath: (
    lineNum,
    {
      type = "json",
      start = 1,
      end = 300,
      apiKey, // import.meta.env 제거 → 인자로 직접 받음
    } = {}
  ) => {
    if (!apiKey) throw new Error("API 키 누락");
    if (!lineNum) throw new Error('lineNum 누락(예: "1호선")');

    const ln = encodeURIComponent(normalizeLine(lineNum));
    return `/${apiKey}/${type}/${SERVICES.SEARCH_STN_BY_LINE}/${start}/${end}///${ln}`;
  },
};
