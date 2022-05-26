const cheerio = require('cheerio')
const axios = require('axios')

module.exports.query = (queryObject) => {
    const query = new Query(queryObject)
    return query.getJobs()
}

//transfers object values passed to our .query to an obj we can access 
function Query (queryObj){
    //query vars
    this.host = queryObj.host || 'www.linkedin.com'
    //api handles strings with spaces by replacing the values with %20
    this.keyword = queryObj.keyword || ''
    this.location = queryObj.location || ''
    this.dateSincePosted = queryObj.dateSincePosted || ''
    this.experienceLevel = queryObj.experienceLevel || ''
    this.jobType = queryObj.jobType || ''
    this.remoteFilter = queryObj.remoteFilter || ''
    this.salary = queryObj.salary || ''
    
    //internal variables
    this.start = 0
    this.limit = Number(queryObj.limit) || 0
}


/*------------------------------------------------------------------------------------------------- */
/*----------These Functions act as switch statements so the query can be constructed with the correct parameters ---------------  */
//to update our query object value so that the query will return the correct jobs
Query.prototype.getDateSincePosted = function(){
    const dateRange = {
        'past month': 'r2592000',
        'past week': 'r604800',
        '24hr': 'r86400',
    }
    return dateRange[this.dateSincePosted.toLowerCase()] ?? ''
}
//to update our query object value so that the query will return the correct jobs
Query.prototype.getExperienceLevel = function(){
    const experienceRange = {
        'internship': '0',
        'entry level': '1',
        'associate': '2',
        'senior': '3',
        'director': '4',
        'executive': '5',
    }
    return experienceRange[this.experienceLevel.toLowerCase()] ?? ''
}
//to update our query object value so that the query will return the correct parameters that LinkedIn API will accept
Query.prototype.getJobType = function(){
    const jobTypeRange = {
        'full time': 'F',
        'part time': 'P',
        'contract': 'C',
        'temporary': 'T',
        'volunteer': 'V'
    }
    return jobTypeRange[this.jobType.toLowerCase()] ?? ''
}
Query.prototype.getRemoteFilter = function(){
    const remoteFilterRange = {
        'on-site':'1',
        'on site': '1',
        'remote': '2',
        'hybrid': '3'
    }
    return remoteFilterRange[this.remoteFilter.toLowerCase()] ?? ''
}
Query.prototype.getSalary = function(){
    const salaryRange = {
        '40000': '1',
        '60000': '2',
        '80000': '3',
        '100000': '4',
        '120000': '5',
    }
    return salaryRange[this.salary.toLowerCase()] ?? ''
}
/*------------------------------------------------------------------------------------------------- */
/*------------------------------------------------------------------------------------------------- */

//Example of Query with the respective values
https://www.linkedin.com/jobs/search/?f_E=2%2C3//////f_JT=F%2CP//////f_SB2=1//////f_TPR=r2592000//////f_WT=2%2C1//////geoId=90000049//////keywords=programmer//////location=Los%20Angeles%20Metropolitan%20Area//////

// Date Posted (Single Pick)	        f_TPR
// Experience Level(Multiple Picks)	    f_E
// Job Type (Multiple Picks)	        f_JT
// On-Site/Remote (Multiple Picks)	    f_WT
// Salary (Single Pick)	                f_SB2

Query.prototype.url = function(start){
    let query = `https://${this.host}/jobs/api/seeMoreJobPostings/search/?f_E=${this.getExperienceLevel()}&f_JT=${this.getJobType()}&f_SB2=${this.getSalary()}&f_TPR=${this.getDateSincePosted()}&f_WT=${this.getRemoteFilter()}&keywords=${this.keyword}&location=${this.location}&start=${start}`
    return encodeURI(query)
}

Query.prototype.getJobs = async function(){
    try {
        let parsedJobs, resultCount = 1, start = 0, jobLimit = this.limit, allJobs = []

        while (resultCount > 0) {
            //fetch our data using our url generator with 
            //the page to start on
            const { data } = await axios.get(this.url(start))

            //select data so we can check the number of jobs returned
            const $ = cheerio.load(data)
            const jobs = $('li')
            //if result count ends up being 0 we will stop getting more jobs
            resultCount = jobs.length
            console.log('I got ', jobs.length, ' jobs')
            
            //to get the job data as objects with the desired details
            parsedJobs = parseJobList(data)
            allJobs.push(...parsedJobs)

            //increment by 25 bc thats how many jobs the api can fetch at a time
            start += 25
            
            //in order to limit how many jobs are returned
            //this if statment will return our function value after looping and removing
            //the extra jobs
            if (jobLimit != 0 && allJobs.length > jobLimit){
                while(allJobs.length != jobLimit) allJobs.pop()
                return allJobs
            }
            
        }
        //console.log(allJobs)
        return allJobs
       
    } catch (error) {
        console.error(error)
    }
}
function parseJobList(jobData){
    const $ = cheerio.load(jobData)
    const jobs = $('li')

    const jobObjects = jobs.map((index, element) => {
        const job = $(element)
        const position = job.find('.base-search-card__title').text().trim() || null
        const company = job.find('.base-search-card__subtitle').text().trim() || null
        const location = job.find('.job-search-card__location').text().trim() || null
        const timePosted = job.find('time').text().trim() || null
        return {
            position: position,
            company: company,
            location: location,
            date: timePosted
        }
    }).get()

    return jobObjects
}
