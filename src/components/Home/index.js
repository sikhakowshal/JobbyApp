import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => (
  <div className="homepage-container">
    <Header />
    <div className="homepage-content-container">
      <div className="homepage-content">
        <h1 className="homepage-title">Find The Job That Fits Your Life</h1>
        <p className="homepage-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button className="find-jobs-button" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </div>
)

export default Home
