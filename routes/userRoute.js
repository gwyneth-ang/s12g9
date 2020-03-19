const express = require('express');
const router = express();
const { ObjectId } = require('mongodb');
const hbs = require('hbs');
const routerFunction = function(db) {
    //helpers for tab2 and tab3
    hbs.registerHelper('ifCD', function(arg1, options) {
        if (arg1 == "Classic Deluxe"){
            return options.fn(this);
        }
        else return options.inverse(this);
    });
    hbs.registerHelper('ifFD', function(arg1, options) {
        if (arg1 == "Family Deluxe"){
            return options.fn(this);
        }
        else return options.inverse(this);
    });
    hbs.registerHelper('ifED', function(arg1, options) {
        if (arg1 == "Executive Deluxe"){
            return options.fn(this);
        }
        else return options.inverse(this);
    });
    hbs.registerHelper('ifJS', function(arg1, options) {
        if (arg1 == "Junior Suite"){
            return options.fn(this);
        }
        else return options.inverse(this);
    });
    hbs.registerHelper('ifES', function(arg1, options) {
        if (arg1 == "Executive Suite"){
            return options.fn(this);
        }
        else return options.inverse(this);
    });
    hbs.registerHelper('ifGS', function(arg1, options) {
        if (arg1 == "Grand Suite"){
            return options.fn(this);
        }
        else return options.inverse(this);
    });
    //check if user is logged in, if not, he/she cannot access the page such as profile and admin， and log out
    const notLoggedInUser = (req, res, next) => {
        if (!req.session.userId) {
            if (!req.session.adminId)
                res.redirect('/signIn'); 
            else
                res.redirect('/admin');
        } 
        return next();
    };
    
    // TODO: all tabs done- double check for errors
    router.get('/',notLoggedInUser ,function(req, res) {
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

        if (req.session.userId){
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

        if (req.session.adminId){
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
        var user=null;
        var today = new Date();
        var year =  today.getFullYear();
        var month=Number(today.getMonth())+1;
        var day = today.getDate();
        if (day< 10) { 
            day = '0' + day; 
        } 
        if (month < 10) { 
            month = '0' + month; 
        } 
        var today = year + '-' + month + '-' + day; 
        db.collection('users').find({ 
            _id:ObjectId(req.session.userId)
        }).toArray().then(function(resp){
                user=resp;
                // console.log(resp[0].email);
                db.collection('bookings').find({ 
                    email:user[0].email,
                    checkInDate: {$gte:today.toString()},
                    status:"Booked"
                }).toArray().then(r=> {
                    db.collection('bookings').find({ 
                        email:user[0].email,
                        checkInDate: {$lt:today.toString()},
                        status:"Booked"
                    }).toArray().then(r2 =>{
                        res.render('profile', {
                            name: user[0].fname+" "+ user[0].lname,
                            membershipNumber: user[0].membershipNumber,
                            email: user[0].email,
                            creditCard: user[0].creditcardNumber,
                            points:user[0].membershipPoints,
                            whichfooter: footertype,
                            logging: loggingstring,
                            tab2:r,
                            tab3:r2
                        });
                    });    
                });
            // return res.status(201);
        }).catch(err => {
            // res.render('profile', {
            //     message:"An error occured! Please reload the page!.",
            //     whichfooter: footertype,
            //     logging: loggingstring
            // });
            console.log(err);
            return res.status(500);
        });
    });   

    // Post for Cancel Reservation
    // TODO: FINISH THIS
    router.post('/',function(req, res) {
        // add delete from db code here
        db.collection('bookings').updateOne(
            {
                checkInDate: req.body.checkIn,
                checkOutDate: req.body.checkOut,
                roomType: req.body.roomType,
                numOfRooms: req.body.numRooms,
                numOfAdults: req.body.numAdults,
                numOfKids:req.body.numKids,
                email:req.body.email,
                status:"Booked"
            },
            {
                $set:{ status: 'Cancelled' }
            }
        ). then(resp=>{
            db.collection('users').updateOne(
                {email:req.body.email},
                {
                    $inc: {cancellationCount:1}
                }
            ).then(r=>res.redirect("/user")
            ).catch(er=>console.log(er));
        }).catch(err=> console.log(err))
        
    });

    return router;
}

module.exports = routerFunction;