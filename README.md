# linkedin-job-scraper

[![npm package](https://nodei.co/npm/linkedin-job-scraper.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/linkedin-job-scraper)

### A Node.js package for getting job listings from LinkedIn

## Note on stability

If LinkedIn changes their UI, this library might stop working. If you encounter issues, please submit an issue/PR and I will get to it when I can. If you use this package regularly and are interested in helping maintain it, please reach out.

## Installation

You can install using [npm](https://www.npmjs.com/package/linkedin-job-scraper).

```
npm i linkedin-job-scraper
```

Include the package

```
const linkedin = require('linkedin-job-scraper');
```

Basic Usage:

```
const queryOptions = {
  keyword: 'software engineer',
  location: 'los angeles',
  dateSincePosted: 'past Week',
  jobType: 'full time',
  remoteFilter: 'remote',
  salary: '100000',
  experienceLevel: 'entry level',
  limit: '20'
};

linkedIn.query(queryOptions).then(response => {
	console.log(response); // An array of Job objects
});
```

## Query Object Parameters

query() accepts a _queryOptions_ object and returns an array of _Job_ objects.

| Parameter    | LinkedIn Default value| Description                                                                                    |
|:-----------:|:---------------------:|:----------------------------------------------------------------------------------------------:| 
| keyword     |       ""              | _string_ - The text to search: (i.e. Software Developer)                                                           |         
| location    |       ""              | _string_ - The name of the city: (i.e. Los Angeles)   
| dateSincePosted|    ""              | _string_ - Max range of jobs: `past month`, `past week`, `24hr`
| jobType     |       ""              | _string_ - Type of position: `full time`, `part time`, `contract`, `temporary`, `volunteer`
| remoteFilter|       ""              | _string_ - Filter telecommuting: `on site`, `remote`, `hybrid`
| salary      |       ""              | _string_ - Minimum Salary: `40000`, `60000`, `80000`, `100000`, `120000`
| experienceLevel|    ""              | _string_ - `internship`, `entry level`, `associate`, `senior`, `director`, `executive`
| limit       |       ""              | _string_ - Number of jobs returned: (i.e. '1', '10', '100', etc)

## Job Objects

| Paramter    | Description (Default: null)                                                                    |
|:-----------:|:----------------------------------------------------------------------------------------------:| 
| position    | _string_ - Position title
| company     | _string_ - Company name
| location    | _string_ - Location of the job
| date        | _string_ - Date the job was posted
| salary      | _string_ - Salary range
| jobUrl      | _string_ - URL of the job page

## Contributing

If you have an idea on how to improve this package, feel free to contribute!

1. Clone or fork the repository
2. Make changes
3. Submit a pull request
