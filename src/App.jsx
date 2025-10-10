<<<<<<< HEAD
import './App.css'
import { Outlet } from "react-router-dom";
function App() {
  
  return (
    <>
      <Outlet />
    </>
  )
} 
=======
import { Outlet, useMatches } from 'react-router-dom'
import './App.css'
import Header from './components/common/Header.jsx';
import Main from './components/Main.jsx';
import { useEffect, useState } from 'react';

function App() {
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem("introSeen"));

  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("introSeen", "true");
      }, 2500); // 2.5초 후 인트로 제거
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  
  const matches = useMatches();
  const current = matches.at(-1);
  const hideParent = current?.handle?.hideParent === true;

  if (hideParent) return <Outlet />;

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      { showIntro && <Main /> } {/* 호선 목록 페이지 위에 겹쳐서 표시 */}
    </>
  )
}
>>>>>>> c24d33c (251010 header 추가)

export default App;