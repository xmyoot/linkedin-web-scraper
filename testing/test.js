const linkedIn = require('../index.js')

linkedIn.query({ keyword: 'software', location: 'hawaii', dateSincePosted: 'past week', limit: '145' })
        .then( response => {
            console.log(response)
        })
        .catch( error => console.error(error))

// const result = linkedIn.query({ keyword: 'programmer', remoteFilter: 'remote', experienceLevel: 'entry level', dateSincePosted: 'past week' })
// console.log(result)