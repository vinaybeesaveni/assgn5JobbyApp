import {Link} from 'react-router-dom'
import {Component} from 'react'
import Header from '../Header'
import './index.css'

class Home extends Component {
  render() {
    return (
      <div className="home-container">
        <Header />
        <div className="home-content-container">
          <h1 className="home-heading">Find the Job That Fits Your Life</h1>
          <p className="home-description">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <button type="button" className="find-jobs-btn">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Home
