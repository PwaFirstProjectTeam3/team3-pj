import { Link } from "react-router-dom";
import './LineList.css';

function LineList() {

  return (
    <> 
      <div className='linelist-container'>
        <div className='line-card'>
          <Link to="/linesdetail/1" className="line-card-link"><p className="number">1</p><p className="text">호선</p></Link>
          <div className='lavel line-1'></div>
        </div>
        <div className='line-card'>
          <Link to="/linesdetail/2" className="line-card-link"><p className="number">2</p><p className="text">호선</p></Link>
          <div className='lavel line-2'></div>
        </div>
        <div className='line-card'>
          <Link to="/linesdetail/3" className="line-card-link"><p className="number">3</p><p className="text">호선</p></Link>
          <div className='lavel line-3'></div>
        </div>
        <div className='line-card'>
          <Link to="/linesdetail/4" className="line-card-link"><p className="number">4</p><p className="text">호선</p></Link>
          <div className='lavel line-4'></div>
        </div>
        <div className='line-card'>
          <Link to="/linesdetail/5" className="line-card-link"><p className="number">5</p><p className="text">호선</p></Link>
          <div className='lavel line-5'></div>
        </div>
        <div className='line-card'>
          <Link to="/linesdetail/6" className="line-card-link"><p className="number">6</p><p className="text">호선</p></Link>
          <div className='lavel line-6'></div>
        </div>
        <div className='line-card'>
          <Link to="/linesdetail/7" className="line-card-link"><p className="number">7</p><p className="text">호선</p></Link>
          <div className='lavel line-7'></div>
        </div>
        <div className='line-card'>
          <Link to="/linesdetail/8" className="line-card-link"><p className="number">8</p><p className="text">호선</p></Link>
          <div className='lavel line-8'></div>
        </div>
        <div className='line-card'>
          <Link to="/linesdetail/9" className="line-card-link"><p className="number">9</p><p className="text">호선</p></Link>
          <div className='lavel line-9'></div>
        </div>
      </div>
    </>
  )
}

export default LineList;