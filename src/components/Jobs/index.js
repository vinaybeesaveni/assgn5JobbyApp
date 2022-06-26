import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {BsSearch, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
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
    jobDetails: [],
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
    // console.log(url)
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
    } else {
      this.setState({apiStatusForJobs: apiStatusConstants.failure})
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
        <h1 className="profile-name">{profileData.name}</h1>
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

  renderNoJobsView = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="job-details-failure-img"
      />
      <h1 className="job-failure-heading">No Jobs Found</h1>
      <p className="failure-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobDetails} = this.state
    if (jobDetails.length === 0) {
      return this.renderNoJobsView()
    }
    return (
      <ul className="jobs-list-container">
        {jobDetails.map(each => (
          <li className="job-item" key={each.id}>
            <Link to={`/jobs/${each.id}`} className="job-item-link">
              <div className="job-image-container">
                <img
                  src={each.companyLogoUrl}
                  alt="company logo"
                  className="company-logo"
                />
                <div>
                  <h1 className="job-title">{each.title}</h1>
                  <div className="rating-container">
                    <AiFillStar className="star-icon" />
                    <p className="rating">{each.rating}</p>
                  </div>
                </div>
              </div>
              <div className="salary-container">
                <div className="location-employment-type-container">
                  <div className="location-container">
                    <MdLocationOn className="location-icon" />
                    <p className="location">{each.location}</p>
                  </div>
                  <div className="location-container">
                    <BsFillBriefcaseFill className="location-icon" />
                    <p className="location">{each.employmentType}</p>
                  </div>
                </div>
                <p className="package-per-annum">{each.packagePerAnnum}</p>
              </div>
              <h1 className="description-heading">Description</h1>
              <p className="job-description">{each.jobDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderJobsFailureView = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-details-failure-img"
      />
      <h1 className="job-failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {apiStatusForJobs} = this.state
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

  onSalaryChange = event => {
    const salary = event.target.value
    const salary2 = salary.split(' ')
    const salary3 = JSON.stringify(parseInt(salary2[0]) * 100000)
    console.log(salary3)
    this.setState({salaryRange: salary3}, this.getJobs)
  }

  onEmploymentTypeChange = event => {
    const {employmentTypeArray} = this.state
    if (event.target.checked) {
      employmentTypeArray.push(event.target.value)
    } else {
      employmentTypeArray.pop(event.target.value)
    }
    console.log(employmentTypeArray)
    this.setState({employmentTypeArray}, this.getJobs)
  }

  onSearchInputChange = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickingSearchIcon = () => {
    this.getJobs()
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="jobs-container">
        <Header />
        <div className="jobs-content-container">
          <div className="job-filters-container">
            <div className="search-input-container">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                onChange={this.onSearchInputChange}
                value={searchInput}
              />
              <button
                type="button"
                className="search-btn"
                onClick={this.onClickingSearchIcon}
                testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div className="profile-container">
              {this.renderProfileDetails()}
            </div>
            <div>
              <h1 className="employment-type-heading">Type of Employment</h1>
              <ul className="employment-type-list-container">
                {employmentTypesList.map(each => (
                  <li className="list-item" key={each.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={each.employmentTypeId}
                      className="checkbox"
                      onChange={this.onEmploymentTypeChange}
                      value={each.employmentTypeId}
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
              <h1 className="employment-type-heading">Salary Range</h1>
              <ul className="salary-range-list-container">
                {salaryRangesList.map(each => (
                  <li className="list-item" key={each.salaryRangeId}>
                    <input
                      type="radio"
                      id={each.salaryRangeId}
                      className="checkbox"
                      onChange={this.onSalaryChange}
                      value={each.label}
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
          </div>
          <div className="job-details-container">
            <div className="search-input-container-medium">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                onChange={this.onSearchInputChange}
                value={searchInput}
              />
              <button
                type="button"
                className="search-btn"
                onClick={this.onClickingSearchIcon}
                testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobDetails()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
