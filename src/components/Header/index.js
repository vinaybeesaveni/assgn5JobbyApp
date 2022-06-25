import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="navbar">
      <img
        src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        alt="website logo"
        className="website-logo-home-page"
      />
      <ul className="list-container">
        <li>
          <Link to="/" className="nav-link">
            <AiFillHome className="nav-icon" />
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="nav-link">
            <BsFillBriefcaseFill className="nav-icon" />
          </Link>
        </li>
        <li>
          <button type="button" className="logout-btn" onClick={onLogout}>
            <FiLogOut className="nav-icon" />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
