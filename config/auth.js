
// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '755609899918-75bcfgog0m8h3mghf3u79u3in1f1c2ge.apps.googleusercontent.com', // your App ID
        'clientSecret'  : 'uNDZemBcxnzLBIH3A_gXF7Mz', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '570534899419-iiib6k30f2g8e5nr72t6c5fjr40jaf7c.apps.googleusercontent.com',
        'clientSecret'  : 'UVPRZBI0q0ebgFomWjqWij6R',
        'callbackURL'   : 'https://rocky-badlands-27666.herokuapp.com/auth/google/callback'
        //'callbackURL'   : 'https://rocky-badlands-27666.herokuapp.com/auth/google/callback'
    }

};
