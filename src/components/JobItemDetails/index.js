import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import {MdLocationOn} from 'react-icons/md'
import Loader from 'react-loader-spinner'

import Header from '../Header'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsList: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }

      this.setState({
        jobDetailsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="job-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickFailureButton = () => {
    this.getJobDetails()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-view-title">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="failure-button"
        onClick={this.onClickFailureButton}
      >
        Retry
      </button>
    </div>
  )

  renderSimilarJobItem = similarJobDetails => {
    const updatedSimilarJobsDetails = {
      companyLogoUrl: similarJobDetails.company_logo_url,
      employmentType: similarJobDetails.employment_type,
      jobDescription: similarJobDetails.job_description,
      location: similarJobDetails.location,
      rating: similarJobDetails.rating,
      title: similarJobDetails.title,
      id: similarJobDetails.id,
    }

    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      rating,
      title,
      id,
    } = updatedSimilarJobsDetails

    return (
      <li className="similar-job-item" key={id}>
        <div className="similar-job-logo-container">
          <img
            src={companyLogoUrl}
            className="similar-job-logo"
            alt="similar job company logo"
          />
          <div className="similar-job-title-container">
            <h1 className="similar-job-title">{title}</h1>
            <div className="similar-job-rating-container">
              <AiFillStar className="similar-job-star" />
              <p className="similar-job-rating">{rating}</p>
            </div>
          </div>
        </div>
        <h1 className="similar-job-subheading">Description</h1>
        <p className="similar-job-description">{jobDescription}</p>
        <div className="similar-job-info-container">
          <div className="similar-job-info-item">
            <MdLocationOn className="similar-job-icon" />
            <p className="similar-job-info-text">{location}</p>
          </div>
          <div className="similar-job-info-item">
            <BsFillBriefcaseFill className="similar-job-icon" />
            <p className="similar-job-info-text">{employmentType}</p>
          </div>
        </div>
      </li>
    )
  }

  renderJobDetailsItem = jobDetails => {
    const updatedJobDetails = {
      companyLogoUrl: jobDetails.company_logo_url,
      companyWebsiteUrl: jobDetails.company_website_url,
      employmentType: jobDetails.employment_type,
      id: jobDetails.id,
      jobDescription: jobDetails.job_description,
      skills: jobDetails.skills,
      lifeAtCompany: jobDetails.life_at_company,
      location: jobDetails.location,
      packagePerAnnum: jobDetails.package_per_annum,
      rating: jobDetails.rating,
      title: jobDetails.title,
    }

    const {skills} = updatedJobDetails
    const updatedSkills = skills.map(each => ({
      imageUrl: each.image_url,
      name: each.name,
    }))

    const {lifeAtCompany} = updatedJobDetails
    const updatedLifeAtCompany = {
      description: lifeAtCompany.description,
      imageUrl: lifeAtCompany.image_url,
    }

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = updatedJobDetails

    return (
      <div className="job-details-container">
        <div className="job-details-logo-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="job-details-company-logo"
          />
          <div className="job-details-title-container">
            <h1 className="job-details-title">{title}</h1>
            <div className="job-details-rating-container">
              <AiFillStar className="job-details-star" />
              <p className="job-details-rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-details-info-container">
          <div className="job-details-location-type-container">
            <div className="info-container">
              <MdLocationOn className="job-details-icon" />
              <p className="job-info-text">{location}</p>
            </div>
            <div className="info-container">
              <BsFillBriefcaseFill className="job-details-icon" />
              <p className="job-info-text">{employmentType}</p>
            </div>
          </div>
          <p className="job-details-package">{packagePerAnnum}</p>
        </div>
        <hr className="job-details-line" />
        <div className="job-details-description-container">
          <div className="job-details-description-title-container">
            <h1 className="job-details-description-title">Description</h1>
            <button className="company-website-button" type="button">
              <a
                href={companyWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="website-link"
              >
                Visit
              </a>
              <FiExternalLink className="job-details-link-icon" />
            </button>
          </div>
          <p className="job-details-description">{jobDescription}</p>
        </div>
        <div className="skills-container">
          <h1 className="job-details-subheading">Skills</h1>
          <ul className="skills-list">
            {updatedSkills.map(each => (
              <li className="skill-item" key={each.name}>
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skills-img"
                />
                <p className="skills-title">{each.name}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="life-at-company-container">
          <h1 className="job-details-subheading">Life at Company</h1>
          <div className="life-at-company-info-container">
            <p className="life-at-company-description">
              {updatedLifeAtCompany.description}
            </p>
            <img
              src={updatedLifeAtCompany.imageUrl}
              className="life-at-company-img"
              alt="life at company"
            />
          </div>
        </div>
      </div>
    )
  }

  renderSuccessView = () => {
    const {jobDetailsList} = this.state
    const {jobDetails, similarJobs} = jobDetailsList

    return (
      <>
        {this.renderJobDetailsItem(jobDetails)}
        <div className="similar-jobs-container">
          <h1 className="similar-jobs-title">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobs.map(each => this.renderSimilarJobItem(each))}
          </ul>
        </div>
      </>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.loading:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-bg-container">
        <Header />
        <div className="details-container">{this.renderJobDetails()}</div>
      </div>
    )
  }
}

export default JobItemDetails
