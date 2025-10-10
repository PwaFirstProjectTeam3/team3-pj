import './EvacuationIndex.css';

function EvacuationIndex() {


  return (
    <>
      <div className="evacuation-container">
        <div className='evacuation-search-box'>
          <div className='line-search'>
            <label htmlFor="line-select">호선</label>
            <select className='evacuation-input' defaultValue="" id="line-select">
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
          <div className='station-search'>
            <label htmlFor="station-search-input">역 명</label>
            <input className='evacuation-input' type="text" id='station-search-input' />
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