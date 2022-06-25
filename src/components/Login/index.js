import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showLoginError: false, error: ''}

  submitFailure = err => {
    this.setState({showLoginError: true, error: err})
  }

  submitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  onUsernameChange = event => {
    this.setState({username: event.target.value})
  }

  onPasswordChange = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, error, showLoginError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
          <form className="form" onSubmit={this.submitForm}>
            <div className="username-container">
              <label htmlFor="username">USERNAME</label>
              <br />
              <input
                type="text"
                id="username"
                placeholder="Username"
                onChange={this.onUsernameChange}
                value={username}
                className="username-input"
              />
            </div>
            <div className="username-container">
              <label htmlFor="password">PASSWORD</label>
              <br />
              <input
                type="password"
                id="password"
                placeholder="Password"
                onChange={this.onPasswordChange}
                value={password}
                className="username-input"
              />
              {showLoginError && <p className="error-msg">* {error}</p>}
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
