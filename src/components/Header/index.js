import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="header">
      <div className="header-content">
        <Link to="/">
          <img
            className="navbar-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <div className="navbar-lg-items-container">
          <div className="nav-links-container">
            <Link to="/" className="nav-link">
              <h1 className="navbar-lg-link home-link">Home</h1>
            </Link>
            <Link to="/jobs" className="nav-link">
              <h1 className="navbar-lg-link">Jobs</h1>
            </Link>
          </div>
          <button className="logout-btn" type="button" onClick={onClickLogout}>
            Logout
          </button>
        </div>
        <ul className="navbar-sm-items-container">
          <li>
            <Link to="/" className="nav-link">
              <AiFillHome className="nav-sm-item" size={30} />
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="nav-link">
              <BsFillBriefcaseFill size={30} className="nav-sm-item" />
            </Link>
          </li>
          <li>
            <button
              className="logout-sm-button"
              type="button"
              onClick={onClickLogout}
            >
              <FiLogOut size={30} className="nav-sm-item" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
