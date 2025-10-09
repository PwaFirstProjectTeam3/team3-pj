// src/store/thunks/subwayLinesThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../configs/axiosClient";
import { ENDPOINTS } from "../../configs/keys.js";

const LineForCompare = (s) => {
  // '01호선'|'1호선' -> '1호선'
  const m = String(s).match(/^0?([1-9])\s*호선$/);
  return m ? `${m[1]}호선` : String(s).trim();
};

export const fetchSubwayLineStations = createAsyncThunk(
  "subwayLines/fetchStations",
  async (lineNum, { rejectWithValue }) => {
    try {
      const PAGE = 300;
      let start = 1, end = PAGE;
      const all = [];

      while (true) {
        const path = ENDPOINTS.searchStnByLinePath(lineNum, {
          start, end,
          apiKey: "서울열린데이터광장api키값", 
        }); 
        const { data } = await axios.get(path);

        const rows = Array.isArray(data?.SearchSTNBySubwayLineInfo?.row)
          ? data.SearchSTNBySubwayLineInfo.row
          : [];
        if (!rows.length) break;

        all.push(...rows);

        if (rows.length < (end - start + 1)) break;
        start = end + 1;
        end = start + PAGE - 1;
      }

      const target = LineForCompare(lineNum); // '1호선'
      const onlyThisLine = all.filter(
        (r) => LineForCompare(r.LINE_NUM || r.LINE_NM) === target
      );

      // 중복 제거: 코드+라인+이름으로 키 구성(충돌 방지)
      const uniqueByCombo = [
        ...new Map(
          onlyThisLine.map((r) => [
            `${r.STATION_CD || r.STATION_CODE || r.station_cd}-${r.LINE_NUM || ""}-${r.STATION_NM || ""}`,
            r,
          ])
        ).values(),
      ];

      return { lineNum, stations: uniqueByCombo };
    } catch (e) {
      console.error("[thunk][ERR]", e?.message, e?.response?.status, e?.response?.data);
      return rejectWithValue(e?.message || "fetch error");
    }
  }
);