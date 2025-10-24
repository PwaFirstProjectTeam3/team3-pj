import { useMemo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ROUTE_DISPLAY } from "../../configs/line-list-configs/subwayLinesRouteConfig.js";
import LINE_COLORS from "../../configs/lineColors.js";
import "./LinesDetail.css";
import SUBWAY_ID_LABEL from "../../configs/line-list-configs/linesDetailSubwayNum.js";

/* ───────── API */
const API_KEY = "7645675657716f773239596a787471";
const BASE_URL = "http://swopenAPI.seoul.go.kr/api/subway";
const URL_ALL = `${BASE_URL}/${API_KEY}/json/realtimeStationArrival/ALL`;

/* ───────── 노선별 절대 길이(px) */
const LEN_MAP = {
  "1호선": 7956,
  "2호선": 3978,
  "3호선": 3432,
  "4호선": 3978,
  "5호선": 4368,
  "6호선": 3042,
  "7호선": 4134,
  "8호선": 1872,
  // 필요 시 추가: "공항철도": 0000,
};

/* ───────── 유틸 (정규화 1개만) */
function normalizeStationKey(name) {
  return String(name)
    .normalize("NFC")
    .replace(/역$/, "")
    .replace(/\(.*?\)/g, "")
    .replace(/[·ㆍ・.\-–—]/g, "")
    .replace(/\s+/g, "")
    .trim();
}
function makeRoughStation(raw) {
  return String(raw ?? "").replace(/\(.*?\)/g, "").replace(/\s+/g, "");
}
function parseLineHeader(label) {
  const m = String(label).match(/([0-9]+)\s*호선/);
  return m ? { num: m[1], suffix: "호선" } : { num: String(label), suffix: "" };
}

/* ───────── 스크롤 상태 훅 */
function useScrollState(ref) {
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
      const y = el.scrollTop;
      setAtTop(y <= 0);
      setAtBottom(maxScroll > 0 ? y >= maxScroll - 1 : true);
      setHasOverflow(maxScroll > 0);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [ref]);

  return { atTop, atBottom, hasOverflow };
}

/* ───────── 한 호선 전용 페이지 (B안) */
function LinesDetail() {
  const navigate = useNavigate();
  const { lineId } = useParams(); // e.g. 'line2'

  // '2호선' 같은 라벨
  const lineLabelFull = useMemo(() => {
    const n = lineId?.match(/\d+/)?.[0] ?? "";
    return n ? `${n}호선` : String(lineId ?? "");
  }, [lineId]);
  const { num: lineNumOnly, suffix: lineSuffix } = parseLineHeader(lineLabelFull);

  // 색상
  const lineColor = useMemo(
    () => LINE_COLORS[lineLabelFull] ?? "#000000",
    [lineLabelFull]
  );

  // 화면 표시용 역 목록
  const stations = useMemo(() => {
    const names = Array.isArray(ROUTE_DISPLAY[lineLabelFull])
      ? ROUTE_DISPLAY[lineLabelFull]
      : [];
    return names.map((name, idx) => ({ name: String(name), idx }));
  }, [lineLabelFull]);

  // 역명 → index 매핑
  const routeIndexByKey = useMemo(() => {
    const map = new Map();
    stations.forEach((st, i) => map.set(normalizeStationKey(st.name), i));
    return map;
  }, [stations]);

  // refs
  const scrollerRef = useRef(null);     // 스크롤 컨테이너 (.linesdetail-stations-height)  overflow-y: auto
  const stationsListRef = useRef(null); // 실제 리스트(.linesdetail-stations)  position: relative; 필수
  const overlayRef = useRef(null);      // 아이콘 오버레이(absolute; inset:0)
  const stationRefs = useRef({});       // 각 역 DOM(ref)

  // 오버레이 높이(콘텐츠 전체 scrollHeight 동기화)
  const [overlayHeight, setOverlayHeight] = useState(0);

  // 스크롤 상태
  const { atTop, atBottom, hasOverflow } = useScrollState(scrollerRef);

  // 상태
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [trains, setTrains] = useState([]);      // {id, dir, name(key), rawName, eta, msg, orderIdx, lineLabel}
  const [positions, setPositions] = useState({}); // {id: topPx}

  // 겹침 방지 오프셋
  const stackedOffsets = useMemo(() => {
    const groups = new Map();
    trains.forEach((t) => {
      const key = `${t.dir}-${t.orderIdx ?? -1}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(t.id);
    });
    const offsets = new Map();
    groups.forEach((ids) => {
      const mid = (ids.length - 1) / 2;
      ids.forEach((id, i) => offsets.set(id, (i - mid) * 14));
    });
    return offsets;
  }, [trains]);

  // 이 라인 소속 판정(느슨 매칭)
  const belongsToRoute = (raw) => {
    const key = normalizeStationKey(raw);
    if (routeIndexByKey.has(key)) return true;
    const key2 = normalizeStationKey(makeRoughStation(raw));
    return routeIndexByKey.has(key2);
  };

  // API 폴링(10s) → 현재 호선 역에 매칭
  useEffect(() => {
    if (!stations.length || routeIndexByKey.size === 0) return;

    let cancelled = false;
    let timer;

    const toDir = (v) => {
      const s = String(v ?? "");
      if (/상|내|up|UP|상행/.test(s)) return "up";
      if (/하|외|down|DOWN|하행/.test(s)) return "down";
      if (s === "0") return "up";
      if (s === "1") return "down";
      return "down";
    };
    const toETA = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const fetchOnce = async () => {
      setStatus("loading");
      setError(null);
      try {
        const { data } = await axios.get(URL_ALL);
        const list = Array.isArray(data?.realtimeArrivalList)
          ? data.realtimeArrivalList
          : [];

        const filtered = list.filter((a) => belongsToRoute(a?.statnNm));

        const mapped = filtered.map((a) => {
          const raw = String(a?.statnNm ?? "");
          const nameKey = normalizeStationKey(raw);
          const idStable =
            String(a?.btrainNo ?? "") || `${a?.subwayId ?? "X"}-${nameKey}-${a?.updnLine ?? "?"}`;
          return {
            id: idStable,
            dir: toDir(a?.updnLine),
            name: nameKey,
            rawName: raw,
            eta: toETA(a?.barvlDt),
            msg: a?.arvlMsg2 || a?.arvlMsg3 || "",
            orderIdx: routeIndexByKey.get(nameKey) ?? Number.POSITIVE_INFINITY,
            lineLabel:
              SUBWAY_ID_LABEL[Number(a?.subwayId)] ?? String(a?.subwayId ?? ""),
          };
        });

        const inRoute = mapped.filter((t) => Number.isFinite(t.orderIdx));
        const up = inRoute.filter(t => t.dir === "up").sort((a,b)=>a.orderIdx-b.orderIdx).slice(0,8);
        const down = inRoute.filter(t => t.dir === "down").sort((a,b)=>a.orderIdx-b.orderIdx).slice(0,8);

        if (!cancelled) {
          setTrains([...up, ...down]);
          setStatus("succeeded");
        }
      } catch (e) {
        if (!cancelled) {
          setStatus("failed");
          setError(e?.message || "API 요청 실패");
          setTrains([]);
        }
      }
    };

    fetchOnce();
    timer = setInterval(fetchOnce, 10_000);
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [lineLabelFull, stations.length, routeIndexByKey]);

  /* ───────── 오버레이 높이 = 콘텐츠 전체 높이(scrollHeight) */
  useLayoutEffect(() => {
    const listEl = stationsListRef.current;
    if (!listEl) return;

    const updateHeight = () => {
      setOverlayHeight(listEl.scrollHeight); // 콘텐츠 전체 높이
    };
    updateHeight();

    const ro = new ResizeObserver(updateHeight);
    ro.observe(listEl);

    const scroller = scrollerRef.current;
    const onScroll = () => requestAnimationFrame(updateHeight);
    scroller?.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ro.disconnect();
      scroller?.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ───────── 아이콘 Y좌표 계산: offsetTop 기준(같은 컨테이너 기준) */
  useLayoutEffect(() => {
    const calc = () => {
      const listEl = stationsListRef.current;
      if (!listEl) return;
      const next = {};
      for (const t of trains) {
        const idx = routeIndexByKey.get(t.name);
        const el = stationRefs.current[idx];
        if (!el) continue;
        const top = el.offsetTop + el.offsetHeight / 2; // 컨테이너 기준
        next[t.id] = Math.max(0, Math.round(top));
      }
      setPositions(next);
    };

    calc();
    let rafId; if (typeof window !== "undefined") rafId = requestAnimationFrame(calc);

    const scroller = scrollerRef.current;
    window.addEventListener("resize", calc);
    scroller?.addEventListener("scroll", calc, { passive: true });

    // 역 DOM 크기/배치 변화도 감지
    const ro = new ResizeObserver(calc);
    Object.values(stationRefs.current).forEach((el) => el && ro.observe(el));

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", calc);
      scroller?.removeEventListener("scroll", calc);
      ro.disconnect();
    };
  }, [trains, routeIndexByKey]);

  // 노선별 절대 길이(px) → CSS var
  useEffect(() => {
    const len = LEN_MAP[lineLabelFull] ?? 0;
    const el = scrollerRef.current;
    if (el) el.style.setProperty("--line-length", len > 0 ? `${len}px` : "");
  }, [lineLabelFull]);

  // 페이드 스타일
  const fadeTopStyle = {
    position: "absolute",
    left: 0, right: 0, top: 0,
    height: 80, pointerEvents: "none",
    background: "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))",
    opacity: atTop || !hasOverflow ? 0 : 1,
    transition: "opacity 160ms",
    zIndex: 30,
  };
  const fadeBottomStyle = {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    height: 80, pointerEvents: "none",
    background: "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
    opacity: atBottom || !hasOverflow ? 0 : 1,
    transition: "opacity 160ms",
    zIndex: 30,
  };

  const displayNameOf = (name) =>
    name.length >= 7 ? name.slice(0, 5) + "..." : name;

  const goToDetails = (station) => {
    navigate(`/linesdetail/${lineId}/details/${station}`);
  };

  return (
    <div className="linesdetail-web-container" style={{ "--line-color": lineColor }}>
      <div className="linesdetail-box">
        {/* 헤더 */}
        <div className="linesdetail-textbox">
          <div className="linesdetail-line-number">{lineNumOnly}{lineSuffix}</div>
        </div>

        {/* 프레임 */}
        <div className="linesdetail-frame">
          {/* 스크롤 컨테이너(바깥) */}
          <div className="linesdetail-stations-height" ref={scrollerRef}>
            <div className="linesdetail-content">
              {/* 리스트(콘텐츠, 반드시 position: relative;) */}
              <div
                className="linesdetail-stations linesdetail-hide-scrollbar"
                ref={stationsListRef}
              >
                {/* ✅ 오버레이: 리스트 내부, 콘텐츠 전체 높이로 확장 */}
                <div
                  className="linesdetail-subwaysbox masked"
                  ref={overlayRef}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    height: overlayHeight ? `${overlayHeight}px` : "100%",
                    pointerEvents: "none",
                  }}
                >
                  <div className="linesdetail-subways">
                    {/* 상행 */}
                    <div className="linesdetail-subway-line-up">
                      {trains.filter(t => t.dir === "up").map((t) => {
                        const top = (positions[t.id] ?? -9999) + (stackedOffsets.get(t.id) ?? 0);
                        return (
                          <img
                            key={t.id}
                            className="linesdetail-subway-up-image"
                            src="/subway.png"
                            alt="상행"
                            title={`${t.rawName} • ${t.lineLabel} (${t.msg})`}
                            style={{
                              position: "absolute",
                              left: 0,
                              top,
                              transform: "translateY(-50%)",
                              transition: "top 400ms ease",
                            }}
                          />
                        );
                      })}
                    </div>
                    {/* 하행 */}
                    <div className="linesdetail-subway-line-down">
                      {trains.filter(t => t.dir === "down").map((t) => {
                        const top = (positions[t.id] ?? -9999) + (stackedOffsets.get(t.id) ?? 0);
                        return (
                          <img
                            key={t.id}
                            className="linesdetail-subway-down-image"
                            src="/subway.png"
                            alt="하행"
                            title={`${t.rawName} • ${t.lineLabel} (${t.msg})`}
                            style={{
                              position: "absolute",
                              right: 0,
                              top,
                              transform: "translateY(-50%)",
                              transition: "top 400ms ease",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 역 아이템 */}
                {stations.map(({ name }, idx) => (
                  <div className="line-box" key={`${lineLabelFull}-${name}-${idx}`}>
                    <div
                      className={`top-line-color ${idx === 0 ? "first" : ""}`}
                      ref={(el) => { if (el) stationRefs.current[idx] = el; }}
                    />
                    <div
                      className="linesdetail-station"
                      onClick={() => goToDetails(name)}
                      ref={(el) => { if (el) stationRefs.current[idx] = el; }}
                    >
                      {displayNameOf(name)}
                    </div>
                    <div
                      className={`bottom-line-color ${idx === stations.length - 1 ? "last" : ""}`}
                      ref={(el) => { if (el) stationRefs.current[idx] = el; }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 외곽 페이드 */}
          <div style={fadeTopStyle} />
          <div style={fadeBottomStyle} />
        </div>
      </div>

      {status === "failed" && (
        <div className="linesdetail-error" role="alert" style={{ marginTop: 8 }}>
          API 오류: {String(error)}
        </div>
      )}
    </div>
  );
}

export default LinesDetail;
