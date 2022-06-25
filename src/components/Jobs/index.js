import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAl',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    profileData: {},
    employmentTypeArray: [],
    salaryRange: '',
    searchInput: '',
    jobDeatils: [],
    apiStatusForJobs: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const profileDetails = data.profile_details
      const updatedData = {
        profileUrl: profileDetails.profile_image_url,
        name: profileDetails.name,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        profileData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({apiStatusForJobs: apiStatusConstants.loading})
    const {employmentTypeArray, salaryRange, searchInput} = this.state
    const employmentArray = employmentTypeArray.join()
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentArray}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const {jobs} = data
      const updatedData = jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        title: each.title,
        rating: each.rating,
      }))
      this.setState({
        apiStatusForJobs: apiStatusConstants.success,
        jobDetails: updatedData,
      })
    }
  }

  renderSuccessView = () => {
    const {profileData} = this.state
    return (
      <div className="profile-success-card">
        <img
          src={profileData.profileUrl}
          alt="profile"
          className="profile-img"
        />
        <p className="profile-name">{profileData.name}</p>
        <p className="bio">{profileData.shortBio}</p>
      </div>
    )
  }

  loadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <button
      type="button"
      className="retry-btn"
      onClick={this.getProfileDetails}
    >
      Retry
    </button>
  )

  renderProfileDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.loading:
        return this.loadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderJobsSuccessView = () => {
    const {jobDetails} = this.state
    return (
      <ul className="jobs-list-container">
        {jobDetails.map(each => (
          <li className="job-item" key={each.id}>
            <div className="job-image-container">
              <img
                src={each.companyLogoUrl}
                alt="name"
                className="company-logo"
              />
              <div>
                <p className="job-title">{each.title}</p>
                <div className="rating-container">
                  <AiFillStar className="star-icon" />
                  <p className="rating">{each.rating}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderJobDetails = () => {
    const {jobDetails, apiStatusForJobs} = this.state
    switch (apiStatusForJobs) {
      case apiStatusConstants.loading:
        return this.loadingView()
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobs-container">
        <Header />
        <div className="jobs-content-container">
          <div className="search-input-container">
            <input
              type="search"
              placeholder="Search"
              className="search-input"
            />
            <BsSearch className="search-icon" />
          </div>
          <div className="profile-container">{this.renderProfileDetails()}</div>
          <div>
            <p className="employment-type-heading">Type of Employment</p>
            <ul className="employment-type-list-container">
              {employmentTypesList.map(each => (
                <li className="list-item" key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    className="checkbox"
                  />
                  <label
                    htmlFor={each.employmentTypeId}
                    className="employment-type-label"
                  >
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="employment-type-heading">Salary Range</p>
            <ul className="salary-range-list-container">
              {salaryRangesList.map(each => (
                <li className="list-item" key={each.salaryRangeId}>
                  <input
                    type="radio"
                    id={each.salaryRangeId}
                    className="checkbox"
                    name="radio"
                  />
                  <label
                    htmlFor={each.salaryRangeId}
                    className="employment-type-label"
                  >
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div>{this.renderJobDetails()}</div>
        </div>
      </div>
    )
  }
}

export default Jobs
