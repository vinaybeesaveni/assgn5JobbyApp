import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import {MdLocationOn} from 'react-icons/md'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAl',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItem extends Component {
  state = {
    jobItemDetails: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetails = data.job_details
      const similarJobs = data.similar_jobs
      const updatedData = {
        id: jobDetails.id,
        companyLogoUrl: jobDetails.company_logo_url,
        employmentType: jobDetails.employment_type,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        title: jobDetails.title,
        rating: jobDetails.rating,
        companyWebsiteUrl: jobDetails.company_website_url,
        lifeAtCompany: jobDetails.life_at_company,
        skills: jobDetails.skills,
        similarJobs,
      }
      this.setState({
        jobItemDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  loadingView = () => (
    <div className="loader-container">
      <div className="loader-container" testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  renderSkills = each => (
    <li key={each.name} className="skill-item">
      <img src={each.image_url} alt={each.name} className="skills-image" />
      <p className="skill-name">{each.name}</p>
    </li>
  )

  renderSimilarJobs = item => {
    const similarJobs = item.map(each => ({
      id: each.id,
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      jobDescription: each.job_description,
      location: each.location,
      packagePerAnnum: each.package_per_annum,
      title: each.title,
      rating: each.rating,
    }))

    return (
      <ul className="similar-jobs-container">
        {similarJobs.map(each => (
          <li className="job-item-similar-jobs" key={each.id}>
            <div className="job-image-container">
              <img
                src={each.companyLogoUrl}
                alt="similar job company logo"
                className="company-logo-jobItem"
              />
              <div>
                <h1 className="job-title-jobItem">{each.title}</h1>
                <div className="rating-container">
                  <AiFillStar className="star-icon-jobItem" />
                  <p className="rating-jobItem">{each.rating}</p>
                </div>
              </div>
            </div>
            <h1 className="description-heading-jobItem-similar-jobs">
              Description
            </h1>
            <p className="job-description-jobItem-similar-jobs">
              {each.jobDescription}
            </p>
            <div className="salary-container-similar-jobs">
              <div className="location-employment-type-container">
                <div className="location-container">
                  <MdLocationOn className="location-icon-jobItem" />
                  <p className="location-jobItem">{each.location}</p>
                </div>
                <div className="location-container">
                  <BsFillBriefcaseFill className="location-icon-jobItem" />
                  <p className="location-jobItem">{each.employmentType}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderSuccessView = () => {
    const {jobItemDetails} = this.state

    return (
      <>
        <div className="job-item-jobItem">
          <div className="job-image-container">
            <img
              src={jobItemDetails.companyLogoUrl}
              alt="job details company logo"
              className="company-logo-jobItem"
            />
            <div>
              <h1 className="job-title-jobItem">{jobItemDetails.title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon-jobItem" />
                <p className="rating-jobItem">{jobItemDetails.rating}</p>
              </div>
            </div>
          </div>
          <div className="salary-container">
            <div className="location-employment-type-container">
              <div className="location-container">
                <MdLocationOn className="location-icon-jobItem" />
                <p className="location-jobItem">{jobItemDetails.location}</p>
              </div>
              <div className="location-container">
                <BsFillBriefcaseFill className="location-icon-jobItem" />
                <p className="location-jobItem">
                  {jobItemDetails.employmentType}
                </p>
              </div>
            </div>
            <p className="package-per-annum">
              {jobItemDetails.packagePerAnnum}
            </p>
          </div>
          <div className="description-link-container">
            <h1 className="description-heading-jobItem">Description</h1>
            <a
              href={jobItemDetails.companyWebsiteUrl}
              className="company-website-link"
            >
              Visit <FiExternalLink className="link-icon" />
            </a>
          </div>
          <p className="job-description-jobItem">
            {jobItemDetails.jobDescription}
          </p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-container">
            {jobItemDetails.skills.map(each => this.renderSkills(each))}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company-description">
              {jobItemDetails.lifeAtCompany.description}
            </p>
            <img
              src={jobItemDetails.lifeAtCompany.image_url}
              alt="life at company"
              className="life-at-company-img"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        {this.renderSimilarJobs(jobItemDetails.similarJobs)}
      </>
    )
  }

  renderFailureView = () => (
    <div className="job-failure-container-similar-jobs">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-details-failure-img"
      />
      <h1 className="job-failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description-similar-jobs">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.loadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-container">
        <Header />
        <div className="job-item-content-container">
          {this.renderJobItemDetails()}
        </div>
      </div>
    )
  }
}

export default JobItem
