/**
 * 숫자만 추출해 정수로 변환합니다. 실패 시 fallback을 반환합니다.
 * @param {any} val
 * @param {number} [fallback=0]
 * @returns {number}
 */
const toInt = (val, fallback = 0) => {
  const n = parseInt(String(val ?? '').replace(/[^0-9-]/g, ''), 10);
  return Number.isFinite(n) ? n : fallback;
};

export const parseXMLResponse = (xmlString) => {
  try {
    if (!xmlString || typeof xmlString !== 'string') return null;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // 파싱 에러 가드
    if (xmlDoc.querySelector('parsererror')) return null;

    const route = xmlDoc.querySelector('route');
    if (!route) return null;

    const getText = (tag) => route.querySelector(tag)?.textContent?.trim() || '';

    // 경로 구간(pathList)
    const pathList = Array.from(route.querySelectorAll('sPath pathList')).map((p) => ({
      startStation: p.querySelector('startStationName')?.textContent?.trim() || '',
      endStation: p.querySelector('endStationName')?.textContent?.trim() || '',
      line: p.querySelector('line')?.textContent?.trim() || '',
      runTime: toInt(p.querySelector('runTime')?.textContent), // minutes
      pathType: p.querySelector('pathType')?.textContent?.trim() || '',
    }));

    // 환승 정보(transferList)
    const transferList = Array.from(route.querySelectorAll('sTransfer transferList')).map((t) => ({
      beforeLine: t.querySelector('beforeLine')?.textContent?.trim() || '',
      afterLine: t.querySelector('afterLine')?.textContent?.trim() || '',
      timeavg: toInt(t.querySelector('timeavg')?.textContent), // minutes
    }));

    // 구간의 시작/끝 역만으로 간단한 체인 구성
    const stationChain = [];
    pathList.forEach((section, idx) => {
      if (idx === 0) stationChain.push(section.startStation);
      stationChain.push(section.endStation);
    });

    // 누적 소요시간(분)으로 각 구간 도착 offset 계산
    let acc = 0;
    const segmentsWithOffsets = pathList.map((section) => {
      acc += section.runTime || 0;
      return { ...section, arrivalOffsetMin: acc };
    });

    return {
      startStation: getText('startStationName'),
      endStation: getText('endStationName'),
      totalTime: toInt(getText('totalTime')),
      transferNum: toInt(getText('transferNum')),
      price: toInt(getText('price')),
      distance: getText('distance'), // 단위 포함 가능성 있어 raw 유지
      pathList: segmentsWithOffsets,
      transferList,
      stationChain,
    };
  } catch (e) {
    console.error('XML parse error:', e);
    return null;
  }
};

export const enrichWithBaseTime = (route, baseDate = new Date()) => {
  if (!route || !Array.isArray(route.pathList)) return route;

  return {
    ...route,
    pathList: route.pathList.map((section) => {
      const dt = new Date(baseDate.getTime() + (section.arrivalOffsetMin || 0) * 60000);
      const hh = String(dt.getHours()).padStart(2, '0');
      const mm = String(dt.getMinutes()).padStart(2, '0');
      return { ...section, arrivalTime: `${hh}:${mm}` };
    }),
  };
};