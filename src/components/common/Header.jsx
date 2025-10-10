import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  // nav를 숨기고 싶은 경로들 모음 배열
  const hiddenPatterns = [

  ]

  const hideNav = hiddenPatterns.some(pattern => pattern.test(location.pathname));

  return(
    <>
      <Link to='/'>
        <img className='header-img' src="/base/header.svg" alt="Metro인서울 헤더" />
      </Link>
      {
        !hideNav && (
        <nav>
          <Link className={`nav-Link ${location.pathname === '/' ? 'nav-Link-selected' : ''}`} to='/'>호선 정보</Link>
          <Link className={`nav-Link ${location.pathname === '/stations' ? 'nav-Link-selected' : ''}`} to='/stations'>경로 검색</Link>
          <Link className={`nav-Link ${location.pathname === '/evacuation' ? 'nav-Link-selected' : ''}`} to='/evacuation'>대피도 조회</Link>
        </nav>
       ) 
      }
    </>
  )
}

export default Header;