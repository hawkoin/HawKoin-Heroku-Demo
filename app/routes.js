module.exports = function (app, passport) {
    var request = require('request');
    var resp = "";
    var emailAddress = null;
    var accessToken;
    var response;
    app.post("/profile", function (req, res) {
        var fromUser = "resource:org.hawkoin.network.Student#" + req.user.google.email;//;
        var toUser = "resource:org.hawkoin.network.Vendor#" + req.body.vid;
        var tmp = { "$class": "org.hawkoin.network.TransferFunds", "amount": req.body.amt, "authToken": accessToken, "fromUser": fromUser, "toUser": toUser };
        console.log(JSON.stringify(tmp));
        request.post(
            'http://35.224.160.182:3000/api/org.hawkoin.network.TransferFunds',
            { json: { "$class": "org.hawkoin.network.TransferFunds", "amount": req.body.amt, "authToken": accessToken, "fromUser": fromUser, "toUser": toUser } },
            function (error, response, body) {
                resp = response.statusCode;
                if (!error && response.statusCode == 200) {
                    console.log(body);
                    resp = 'success';
                } else {
                    console.log("Status!!!: ");
                    console.log(body);
                    console.log(response.statusCode);
                    //resp = JSON.stringify(body);//response.statusMessage;
                    resp = body.error.message;
                }
            }
        );
        res.redirect("/profile");
    });

    app.post("/changeTx", function (req, res) {
        var fromUser = "resource:org.hawkoin.network.Student#" + emailAddress;
        console.log("in changeTx post");
        var tmp = { "$class": "org.hawkoin.network.ChangeLowBalAlert", "thresh": req.body.change, "authToken": accessToken, "fromUser": fromUser };
        console.log(JSON.stringify(tmp));
        request.post(
            'http://35.224.160.182:3000/api/org.hawkoin.network.ChangeLowBalAlert',
            { json: { "$class": "org.hawkoin.network.ChangeLowBalAlert", "thresh": req.body.change, "user": fromUser } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("Status!!!: ");
                    alert(body);
                } else {
                    console.log(body);
                }
            }
        );
        res.redirect("/profile");
    });

    app.post("/changeBreach", function (req, res) {
        var fromUser = "resource:org.hawkoin.network.Student#" + emailAddress;
        console.log("in changeTx post");
        var tmp = { "$class": "org.hawkoin.network.ChangeTxnBreach", "thresh": req.body.change, "authToken": accessToken, "fromUser": fromUser };
        console.log(JSON.stringify(tmp));
        request.post(
            'http://35.224.160.182:3000/api/org.hawkoin.network.ChangeTxnBreach',
            { json: { "$class": "org.hawkoin.network.ChangeTxnBreach", "thresh": req.body.change, "user": fromUser } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                } else {
                    console.log(body);
                }
            }
        );
        res.redirect("/profile");
    });

    app.post('/auth/google/callback', passport.authenticate('google'), function (req, res) {
        // Return user back to client
        res.send(req.user);
    });

    function signInCallback(authResult) {
        if (authResult.code) {
            $.post('/auth/google/callback', { id_token: authResult.id_token })
                .done(function (data) {
                    $('#signinButton').hide();
                });
        } else if (authResult.error) {
            console.log('There was an error: ' + authResult.error);
        }
    };

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        if (emailAddress == null) {
            emailAddress = req.user.google.email;
            accessToken = req.user.google.token;
        }
        //here i would run the get request, and then pass that get request in the render as req.user,\nbalance:req.bal

        request.get(
            'http://35.224.160.182:3000/api/org.hawkoin.network.Student/' + req.user.google.email,

            function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    body = JSON.parse(body);
                    body.code = resp;
                    console.log("Code: " + body.code);
                    res.render('profile.ejs', {
                        user: req.user,
                        body: body// get the user out of session and pass to template
                    });
                } else {
                    res.render('profile.ejs', {
                        body: error
                    });
                }
            }
        );
        // res.render('profile.ejs', {
        //     user: req.user // get the user out of session and pass to template
        // });
    });

    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email', "https://www.googleapis.com/auth/plus.me"] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
