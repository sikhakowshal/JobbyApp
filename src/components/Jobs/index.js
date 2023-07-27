import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch, BsFillBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

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

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    profileDetails: {},
    employmentIdList: [],
    activeSalaryId: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    profileApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

    const {employmentIdList, activeSalaryId, searchInput} = this.state
    const employmentTypesString = employmentIdList.join(',')

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypesString}&minimum_package=${activeSalaryId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const {jobs} = data

      const updatedData = jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.loading})

    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const profileDetails = data.profile_details

      const updatedDetails = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }

      this.setState({
        profileDetails: updatedDetails,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileDetails = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  onClickProfileButton = () => {
    this.getProfileDetails()
  }

  renderRetryButton = () => (
    <div className="loader-container">
      <button
        className="profile-button"
        type="button"
        onClick={this.onClickProfileButton}
      >
        Retry
      </button>
    </div>
  )

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onKeyDownSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  onChangeEmploymentType = event => {
    const {employmentIdList} = this.state
    const lastIndex = employmentIdList.length

    const result = employmentIdList.find(each => each === event.target.value)

    if (result === undefined) {
      employmentIdList.splice(lastIndex, 0, event.target.value)
      console.log(employmentIdList)
      this.setState({employmentIdList}, this.getJobs)
    } else {
      const index = employmentIdList.findIndex(
        item => item === event.target.value,
      )
      employmentIdList.splice(index, 1)
      console.log(employmentIdList)
      this.setState({employmentIdList}, this.getJobs)
    }
  }

  onChangeSalaryRange = event => {
    this.setState({activeSalaryId: event.target.value}, this.getJobs)
  }

  renderNoJobsFound = () => (
    <div className="error-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="error-img"
        alt="no jobs"
      />
      <h1 className="error-title">No Jobs Found</h1>
      <p className="error-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobItem = job => {
    const {
      id,
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = job

    return (
      <Link to={`/jobs/${id}`} className="job-item-link" key={id}>
        <li className="job-item" key={id}>
          <div className="logo-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="company-logo"
            />
            <div className="title-container">
              <h1 className="job-item-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="rating-icon" />
                <p className="rating-title">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details-info-container">
            <div className="job-location-type-container">
              <div className="detail-container">
                <MdLocationOn className="job-details-icon" />
                <p className="job-details-text">{location}</p>
              </div>
              <div className="detail-container">
                <BsFillBriefcaseFill className="job-details-icon" />
                <p className="job-details-text">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="job-item-line" />
          <div className="description-container">
            <h1 className="description-title">Description</h1>
            <p className="description">{jobDescription}</p>
          </div>
        </li>
      </Link>
    )
  }

  renderSuccessView = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return this.renderNoJobsFound()
    }

    return (
      <ul className="jobs-list-container">
        {jobsList.map(job => this.renderJobItem(job))}
      </ul>
    )
  }

  onClickFailureButton = () => {
    this.getJobs()
  }

  renderFailureView = () => (
    <div className="error-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="error-img"
        alt="failure view"
      />
      <h1 className="error-title">Oops! Something Went Wrong</h1>
      <p className="error-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="failure-button"
        onClick={this.onClickFailureButton}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileSection = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileDetails()
      case apiStatusConstants.failure:
        return this.renderRetryButton()
      case apiStatusConstants.loading:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderJobsList = () => {
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

  onClickSearchButton = () => {
    this.getJobs()
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="jobs-bg-container">
        <Header />
        <div className="jobs-responsive-container">
          <div className="job-filters-container">
            <div className="sm-input-container">
              <input
                type="search"
                value={searchInput}
                placeholder="Search"
                className="search-input"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onKeyDownSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onClickSearchButton}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderProfileSection()}
            <hr className="filters-line" />
            <div className="filters-container">
              <h1 className="filters-title">Type of Employment</h1>
              <ul className="filter-container">
                {employmentTypesList.map(each => (
                  <li className="filter-item" key={each.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={each.employmentTypeId}
                      value={each.employmentTypeId}
                      onChange={this.onChangeEmploymentType}
                    />
                    <label htmlFor={each.employmentTypeId} className="label">
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr className="filters-line" />
            <div className="filters-container">
              <h1 className="filters-title">Salary Range</h1>
              <ul className="filter-container">
                {salaryRangesList.map(each => (
                  <li className="filter-item" key={each.salaryRangeId}>
                    <input
                      type="radio"
                      name="salary"
                      id={each.salaryRangeId}
                      value={each.salaryRangeId}
                      onChange={this.onChangeSalaryRange}
                    />
                    <label htmlFor={each.salaryRangeId} className="label">
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="jobs-container">
            <div className="lg-input-container">
              <input
                type="search"
                value={searchInput}
                placeholder="Search"
                className="search-input"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onKeyDownSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onClickSearchButton}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsList()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
