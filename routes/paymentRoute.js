const express = require('express');
const router = express();
const { ObjectId } = require('mongodb');
var totalChargeBody, lastname, firstname, emailglobe, database;
var payBody, cardowner, idBook, card, cardNum, databasepay;
var imagesource;

//totalCharge
const routerFunction = function(db) {
    router.get('/', function(req, res) {

        var headertype = 'header';
        var footertype = 'footer';
        var totalChargetype = 'totalChargeGuest';
        var point = "";

        // console.log(req.session.userId);
        if (req.session.userId) {
            headertype = 'headerUser';
            footertype = 'footerUser';
            totalChargetype = 'totalChargeUser';

            var userid = { _id: ObjectId(req.session.userId) }

            db.collection('users').findOne(userid)
                .then(res => {
                    point = res.membershipPoints;
                    console.log(point);
                }).catch(err => {
                    console.log(err);
                })
        }

        if (req.session.adminId) {
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }

        if (firstname) {
            res.render('totalCharge', {
                data: totalChargeBody,
                fnameError: firstname,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point
            });
        }

        if (lastname) {
            res.render('totalCharge', {
                data: totalChargeBody,
                lnameError: lastname,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point
            });
        }

        if (emailglobe) {
            res.render('totalCharge', {
                data: totalChargeBody,
                emailError: emailglobe,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point
            });
        }

        if (database) {
            res.render('totalCharge', {
                data: totalChargeBody,
                databaseError: emailglobe,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point
            });
        }
    });

    router.post('/', function(req, res) {

        imagesource = req.body.roomtype;
        imagesource = imagesource.replace(/\s/g, '');
        
        var headertype = 'header';
        var footertype = 'footer';
        var totalChargetype = 'totalChargeGuest';
        var point = "";

        if (req.session.userId) {
            headertype = 'headerUser';
            footertype = 'footerUser';
            totalChargetype = 'totalChargeUser';

            var userid = { _id: ObjectId(req.session.userId) }

            db.collection('users').findOne(userid)
                .then(resp => {
                    point = resp.membershipPoints;

                    if (req.body.roomtype === 'Classic Deluxe'){

                        var checkBox = `
                            <div class="row pt-3">\
                                <div class="style">Use Points to Book Classic Deluxe</div>\
                            </div>\
                            <div class="row pt-2">\
                                <div class="subheader">You may either choose to pay or use points for this type of room.</div>\
                            </div>\
                            <div class="row">\
                                <img src="/images/AboutUs/MP.svg" width="97%" height="1%">\
                            </div>\
                            <div class="pb-3 ml-4">\
                                <input class="form-check-input pointfee" type="checkbox" name="classicDeluxe" onclick=calculatePoints() value="classicDeluxe">\
                                <label class="form-check-label" for="gridCheck1">\
                                    Use Points (<span id="classicdeluxepoints">150000</span> points)\
                                </label>\
                            </div>\
                        `
                        
                        return res.render('totalCharge', {
                            data: req.body,
                            source: '/images/Rooms/'+ imagesource + '.jpg',
                            whichheader:  headertype,
                            whichfooter: footertype,
                            whichtotalCharge: totalChargetype,
                            memberPoints: point.toString(),
                            checkboxDiv: checkBox

                        }); 
                    } else {
                        return res.render('totalCharge', {
                            data: req.body,
                            source: '/images/Rooms/'+ imagesource + '.jpg',
                            whichheader:  headertype,
                            whichfooter: footertype,
                            whichtotalCharge: totalChargetype,
                            memberPoints: point.toString()
                        }); 
                    }    
                }).catch (err => {
                    console.log(err);
                })
        }

        if (req.session.adminId) {
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }

        if (!req.session.userId)
            res.render('totalCharge', {
                data: req.body,
                source: '/images/Rooms/'+ imagesource + '.jpg',
                whichheader:  headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point
            }); 
    });

    router.get('/pay', function(req, res) {

        var loggingstring = `
        <li class="nav-item">\
            <a class="nav-link" href="/signUp">Be a Member</a>\
        </li>\
        <li class="nav-item">\
            <a class="nav-link" href="/signIn">Log In</a>\
        </li>\
        <li class="nav-item">\
            <a class="nav-link bookBtn" href="/" tabindex="-1" aria-disabled="true">BOOK NOW</a>\
        </li>\
        `
        var footertype = 'footer';

        if (req.session.userId) {
            loggingstring =
                `<li class="nav-item">\
                <a class="nav-link" href="/hotel/memberBenefits">Member Benefits</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link" href="/logout">Log Out</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link bookBtn" href="/user" tabindex="-1" aria-disabled="true">PROFILE</a>\
            </li>\
            `;
            footertype = 'footerUser';
        }

        if (req.session.adminId) {
            loggingstring =
                `<li class="nav-item">\
                <a class="nav-link" href="/hotel/memberBenefits">Member Benefits</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link" href="/logout">Log Out</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link bookBtn" href="/admin" tabindex="-1" aria-disabled="true">ADMIN</a>\
            </li>\
            `;
            footertype = 'footerAdmin';
        }

        if (cardowner) {
            res.render('pay', {
                data: payBody,
                cardOwnerError: cardowner,
                bookingid: idBook,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        if (card) {
            res.render('pay', {
                data: payBody,
                cardError: card,
                bookingid: idBook,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        if (cardNum) {
            res.render('pay', {
                data: payBody,
                cardNumError: cardNum,
                bookingid: idBook,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        if (databasepay) {
            res.render('pay', {
                data: payBody,
                databaseError: databasepay,
                bookingid: idBook,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

    });

    router.post('/pay', function(req, res) {
        // console.log(req.body);    

        if (!req.session.userId){
            let { fname, lname, email, total, checkInDate, checkOutDate, rooms, adults, kids, roomtype, pricePerRoom} = req.body;

            fname = fname.trim();
            lname = lname.trim();
            email = email.trim();

            lastname = "";
            firstname = "";
            emailglobe = "";
            database = "";

            if (req.body.requests === "")
                req.body.requests = req.body.additionalrequest;
            else
                req.body.requests = req.body.requests + ', ' + req.body.additionalrequest;

            // console.log('Hello');
            // console.log(req.body.requests);
            totalChargeBody = req.body;

            //TODO: retain select options in the future
            if (!fname) {
                firstname = '*Please fill up missing field';
                return res.status(401).redirect('/totalCharge');
            }

            if (!lname) {
                lastname = '*Please fill up missing field';
                return res.status(401).redirect('/totalCharge');
            }

            if (!email) {
                emailglobe = '*Please fill up missing field';
                return res.status(401).redirect('/totalCharge');
            }

            let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

            // dfa validator
            if (!emailRegex.test(email)) {
                req.body.email = "";
                emailglobe = '*Email not valid';
                return res.status(401).redirect('/totalCharge');
            }

            var today = new Date();
            var formattedDate = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0);

            var reservation = {
                fname,
                lname,
                email,
                requests: req.body.requests,
                checkInDate,
                checkOutDate,
                rooms : parseInt(rooms),
                adults : parseInt(adults),
                kids : parseInt(kids),
                roomtype,
                pricePerRoom : parseFloat(pricePerRoom).toFixed(2),
                bookingDate: formattedDate,
                status: "Booked",
                payment: {
                    total,
                    status: "Not Paid",
                    creditcardNumber: "",
                    creditcardOwner: "",
                    cvv: "",
                    ccprovider: "",
                    month: "",
                    year: ""
                }
            };

            var loggingstring = `
            <li class="nav-item">\
                <a class="nav-link" href="/signUp">Be a Member</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link" href="/signIn">Log In</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link bookBtn" href="/" tabindex="-1" aria-disabled="true">BOOK NOW</a>\
            </li>\
            `
            var footertype = 'footer';

            if (req.session.userId) {
                loggingstring =
                    `<li class="nav-item">\
                    <a class="nav-link" href="/hotel/memberBenefits">Member Benefits</a>\
                </li>\
                <li class="nav-item">\
                    <a class="nav-link" href="/logout">Log Out</a>\
                </li>\
                <li class="nav-item">\
                    <a class="nav-link bookBtn" href="/user" tabindex="-1" aria-disabled="true">PROFILE</a>\
                </li>\
                `;
                footertype = 'footerUser';
            }

            if (req.session.adminId) {
                loggingstring =
                    `<li class="nav-item">\
                    <a class="nav-link" href="/hotel/memberBenefits">Member Benefits</a>\
                </li>\
                <li class="nav-item">\
                    <a class="nav-link" href="/logout">Log Out</a>\
                </li>\
                <li class="nav-item">\
                    <a class="nav-link bookBtn" href="/admin" tabindex="-1" aria-disabled="true">ADMIN</a>\
                </li>\
                `;
                footertype = 'footerAdmin';
            }

            db.collection('booking').insertOne(reservation)
                .then(resp => {
                    // console.log(resp);
                    // for debugging and for production
                    // return res.status(201).send('Good');
                    //Use to find in database
                    db.collection('booking').findOne(reservation)
                    .then(respfind => {
                        // console.log(resp._id);
                        // res.redirect('totalCharge/pay/'+resp._id); //resp._id is the id of the database
                        res.render('pay', {
                            bookingid: respfind._id,
                            whichfooter: footertype,
                            logging: loggingstring
                        });
                    }).catch(err => {
                        console.log(err);
                        database = '*Bad Server';
                        return res.status(500).redirect('/totalCharge');
                    })
                }).catch(err => {
                    console.log(err);
                    database = '*Bad Server';
                    return res.status(500).redirect('/totalCharge');
                    // return res.status(500).render('totalCharge',
                    //     {databaseError: '*Bad Server'}
                    // );
                });            
        }
        else {
            let {total, checkInDate, checkOutDate, rooms, adults, kids, roomtype, pricePerRoom, points} = req.body;

            var today = new Date();
            var formattedDate = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0);

            var userID = { _id: ObjectId(req.session.userId) };

            db.collection('users').findOne(userID)
                .then(resp=>{

                    var allpoints = resp.membershipPoints - parseInt(points);
                    allpoints = allpoints + parseInt(total) * 0.10;
                    var update ={
                        $set: {
                            'membershipPoints': parseInt(allpoints)
                        }
                    }

                    db.collection('users').updateOne(userID,update)
                        .then(resppoints=>{
                            var reservationMember = {
                                fname : resp.fname,
                                lname : resp.lname,
                                email : resp.email,
                                requests: req.body.requests,
                                checkInDate,
                                checkOutDate,
                                rooms : parseInt(rooms),
                                adults : parseInt(adults),
                                kids : parseInt(kids),
                                roomtype,
                                pricePerRoom : parseFloat(pricePerRoom).toFixed(2),
                                bookingDate: formattedDate,
                                status: "Booked",
                                payment: {
                                    total,
                                    status: "Not Paid",
                                    creditcardNumber: resp.creditcardNumber,
                                    creditcardOwner: resp.creditcardOwner,
                                    cvv: resp.cvv,
                                    ccprovider: resp.ccprovider,
                                    month: resp.month,
                                    year: resp.year
                                }
                            };
                        
                            db.collection('booking').insertOne(reservationMember)
                                .then(respbook => {
                                        db.collection('booking').findOne(reservationMember)
                                        .then(respfind => {
                                            // console.log("bookid");
                                            // console.log(respfind._id);
                                            res.redirect('/totalCharge/billingDetails/' + respfind._id);
                                        }).catch(errfind => {
                                            console.log(errfind);
                                            database = '*Bad Server';
                                            return res.status(500).redirect('/totalCharge');
                                        })   
                                }).catch((errbook=>{
                                    console.log(errbook);
                                    database = '*Bad Server';
                                    return res.status(500).redirect('/totalCharge');
                                }));

                        }).catch(errpoints => {
                            console.log(errpoints);
                            database = '*Bad Server';
                            return res.status(500).redirect('/totalCharge');

                        });

                }).catch(err=>{
                    console.log(err);
                    database = '*Bad Server';
                    return res.status(500).redirect('/totalCharge');
                });
        }
    });

    //:bookId = means that the url of the website will be ending with the id in the databse
    router.get('/billingDetails/:bookId', function(req, res) {
        var headertype = 'header';
        var footertype = 'footer';

        if (req.session.userId) {
            headertype = 'headerUser';
            footertype = 'footerUser';
        }

        if (req.session.adminId) {
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }
        
        var bookingid = { _id: ObjectId(req.params.bookId) }; 
        // console.log(req.params.bookId);

        db.collection('booking').findOne(bookingid)
            .then(resp=>{
                // console.log(resp);
                var imagesource = resp.roomtype;
                imagesource = imagesource.replace(/\s/g, '');
                res.render('billingDetails', {
                    data: resp,
                    source: '/images/Rooms/' + imagesource + '.jpg',
                    whichfooter: footertype,
                    whichheader: headertype
                })
            }).catch(err=>{
                console.log(err);
            });
    });

    router.post('/billingDetails', function(req, res) {
        res.redirect('/totalCharge/pay');
    });

    router.post('/billingDetails/:bookId', function(req, res) {
        // console.log(req.body);    
        let { owner, cvv, cardNumber, month, year, ccprovider } = req.body;

        cardowner = "";
        card = "";
        cardNum = "";
        databasepay = "";
        idBook = req.params.bookId
        payBody = req.body;

        owner = owner.trim();
        cvv = cvv.trim();
        cardNumber = cardNumber.trim();

        if (!owner) {
            cardowner = '*Please fill up missing field';
            return res.status(401).redirect('/totalCharge/pay');
        }

        if (!cvv) {
            card = '*Please fill up missing field';
            return res.status(401).redirect('/totalCharge/pay');
        }

        if (!cardNumber) {
            cardNum = '*Please fill up missing field';
            return res.status(401).redirect('/totalCharge/pay');
        }

        var bookingid = { _id: ObjectId(req.params.bookId) }; //use to find the id in the database, (const { ObjectId } = require('mongodb'); is needed on top of this file)
        var update = {
            $set: {
                'payment.status': 'Paid',
                'payment.cvv': cvv,
                'payment.creditcardOwner': owner,
                'payment.creditcardNumber': cardNumber,
                'payment.ccprovider': ccprovider,
                'payment.month': month,
                'payment.year': year
            }
        };

        var headertype = 'header';
        var footertype = 'footer';

        if (req.session.userId) {
            headertype = 'headerUser';
            footertype = 'footerUser';
        }

        if (req.session.adminId) {
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }

        //updating the collection of booking
        db.collection('booking').updateOne(bookingid, update)
            .then(resp => {
                console.log(resp);
                // res.redirect('/totalCharge/billingDetails/'+req.params.bookId); //redirecting to a website
                // res.render('billingDetails');
            }).catch(err => {
                console.log(err);
                database = '*Bad Server';
                return res.status(500).redirect('/totalCharge/pay');
            })

        db.collection('booking').findOne(bookingid)
            .then(resp => {
                var imagesource = resp.roomtype;
                imagesource = imagesource.replace(/\s/g, '');
                res.render('billingDetails', {
                    data: resp,
                    source: '/images/Rooms/' + imagesource + '.jpg',
                    whichfooter: footertype,
                    whichheader: headertype
                })
            }).catch(err => {
                console.log(err);
                database = '*Bad Server';
                return res.status(500).redirect('/totalCharge/pay');
            })
    });
    return router;
};


module.exports = routerFunction;