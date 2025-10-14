import './EvacuationIndex.css';
import { line1List } from '../../configs/line-list-configs/line1ListConfig.js';
import { line2List } from '../../configs/line-list-configs/line2ListConfig.js';
import { line3List } from '../../configs/line-list-configs/line3ListConfig.js';
import { line4List } from '../../configs/line-list-configs/line4ListConfig.js';
import { line5List } from '../../configs/line-list-configs/line5ListConfig.js';
import { line6List } from '../../configs/line-list-configs/line6ListConfig.js';
import { line7List } from '../../configs/line-list-configs/line7ListConfig.js';
import { line8List } from '../../configs/line-list-configs/line8ListConfig.js';
import { line9List } from '../../configs/line-list-configs/line9ListConfig.js';
import { useEffect, useRef, useState } from 'react';

const lineMap = {
  "line-1": line1List,
  "line-2": line2List,
  "line-3": line3List,
  "line-4": line4List,
  "line-5": line5List,
  "line-6": line6List,
  "line-7": line7List,
  "line-8": line8List,
  "line-9": line9List,
}

function EvacuationIndex() {
  const [selectedLine, setSelectedLine] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const containerRef = useRef(null);

  // 호선 선택
  function handleLineChange(e) {
    const line = e.target.value;
    setSelectedLine(line);
    setInputValue(""); // 호선 변경 시 input 초기화
    setIsOpen(false);
  }

  // 역 이름 입력 시 상태 갱신
  function handleInputChange(e) {
    setInputValue(e.target.value);
    openDropdown();
  }

  // 드롭다운 열기 (onFocus, 입력 시)
  function openDropdown() {
    setIsOpen(true);
  }

  // 드롭다운 닫기
  function closeDropdown() {
    setIsOpen(false);
  }
  
  // 드롭다운 아이템 클릭 시 input에 값 넣고 드랍다운 닫기
  function handleSelectStation(station) {
    setInputValue(station);
    closeDropdown();
  }

  // 툴팁 출력
  function handleInputFocus() {
    if (!stations.length) {
      setTooltipVisible(true);
    } else {
      setIsOpen(true);
    }
  }
  
  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 선택된 호선의 역 배열 가져오기
  const stations = lineMap[selectedLine] || [];

  // 입력값 기반 실시간 필터링
  const filteredStations =
    inputValue.trim() === "" ? stations : stations.filter((station) => station.includes(inputValue));

  return (
    <>
      <div className="evacuation-container">
        <div className='evacuation-search-box'>
          <div className='line-search'>
            <label htmlFor="line-select">호선</label>
            <select className='evacuation-input' value={selectedLine} onChange={handleLineChange} id="line-select">
              <option value="" disabled hidden>호선을 선택하세요.</option>
              <option value="line-1">1호선</option>
              <option value="line-2">2호선</option>
              <option value="line-3">3호선</option>
              <option value="line-4">4호선</option>
              <option value="line-5">5호선</option>
              <option value="line-6">6호선</option>
              <option value="line-7">7호선</option>
              <option value="line-8">8호선</option>
              <option value="line-9">9호선</option>
            </select>
          </div>
          <div className='station-search' ref={containerRef}>
            <label htmlFor="station-search-input">역 명</label>
            <input className='evacuation-input'
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={() => setTooltipVisible(false)}
              autoComplete="off" // 브라우저 기본 자동완성 기능 끄기
              type="text" id='station-search-input' placeholder='조회하실 역 명을 입력해주세요.'
            />
            <button className='station-search-btn'></button>
            {tooltipVisible && (
              <div className="tooltip">
                <p>호선을 선택해주세요</p>
              </div>
            )}
            {isOpen && filteredStations.length > 0 && (
              <ul className="dropdown">
                {filteredStations.map((station) => (
                  <li
                    key={station}
                    onClick={() => handleSelectStation(station)}
                    onMouseDown={(e) => e.preventDefault()} // input 포커스 유지
                  >
                    {station}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="img-card">
          <img className='evacuation-img' src="/ex/evacuation-img.jpg" alt="대피도 이미지" />
          <img className='expansion-icon' src="/icons/expansion-icon.svg" alt="확대, 축소 및 드래그가 가능하다는 것을 나타내는 아이콘" />
        </div>
      </div>
    </>
  )
}

export default EvacuationIndex;