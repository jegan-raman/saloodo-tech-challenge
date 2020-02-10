const httpStatus  = require('http-status');
const allShipmentData = require('./../data/shipments-data.json');
const allUsers = require('./../data/users-data.json');
const { filter, slice, keyBy, forEach, omit, cloneDeep } = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const config = require('./../config/config.json');
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);

module.exports = {
    login(req,res,next) {
        // console.log('login');
        try {
            // const salt = bcrypt.genSaltSync(saltRounds);
            const password = req.body.password;
            const email = req.body.email;
            let loggedUser;
            forEach(allUsers, (user) => {
                if (user.email == email) {
                    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
                    if (isPasswordCorrect) {
                        loggedUser = cloneDeep(user);
                        delete loggedUser.password;
                    }
                }
            });
            if (loggedUser) {
                let token = jwt.sign(loggedUser, config.JWT_SECTET, {
                    expiresIn: config.TOKEN_LIFE
                });
                token = token.replace(".", config.TOKEN_REPLACE_VALUE);
                loggedUser['token'] = token;

                res.status(httpStatus.OK).json({
                    success: true,
                    data: loggedUser
                });
            } else {
                res.status(httpStatus.NOT_FOUND).json({
                    success: false,
                    error: 'User not found'
                });
            }
        } catch (err) {
            // console.log('err', err);
            next(err);
        }
        
    },
    getDashboardReports(req,res,next) {
        // console.log('getDashboardReports');
        const dashboardReports = {
            TOTAL: allShipmentData.length,
            WAITING: 0,
            ASSIGNED: 0,
            PICKED_UP: 0,
            DELIVERED: 0
        };

        try {
            forEach(cloneDeep(allShipmentData), (value) => {
                dashboardReports[value.orderStatus] = dashboardReports[value.orderStatus] + 1;
            });

            res.status(httpStatus.OK).json({
                success: true,
                data: dashboardReports
            });

        } catch (err) {
            next(err);
        }

    },

    getShipments(req,res,next) {
        // console.log('getShipments');
        const pageNo = req.query.page || 1;
        const size = req.query.size || 10;
        const start = (pageNo - 1) * size;
        const end = pageNo * size;  

        const userId = req.query.userId || '';

        const allBikers = filter(allUsers, { role: 'BIKER' });
        const userObj = keyBy(allBikers, 'id');
        let allShipments = [];
        if (userId) {
            forEach(cloneDeep(allShipmentData), (value) => {
                if (value.assignee && value.assignee == userId) {
                    allShipments.push(value)
                }
            });
        } else {
            allShipments = cloneDeep(allShipmentData);
        }

        const shipmentData = slice(allShipments, start, end); 

        const shipmentList = [];

        forEach(shipmentData, (value) => {
            if (value['assignee'] && userObj[value['assignee']]) {
                value['assigneeDetails'] = omit(userObj[value['assignee']], ['password']);
            }
            shipmentList.push(value);
        });

        try {
            res.status(httpStatus.OK).json({
                success: true,
                data: {
                    count: allShipments.length,
                    rows: shipmentList
                }
            });
        } catch (err) {
            next(err);
        }
    },

    assignShipments (req,res,next) {
        try {
            // console.log('assignShipments');
            forEach (allShipmentData, (shipment) => {
                if (shipment.id == req.body.shipmentId) {
                    shipment['assignee'] = req.body.assignee;
                    shipment['orderStatus'] = "ASSIGNED";
                }
            });
            fs.writeFileSync(appDir + '/data/shipments-data.json', JSON.stringify(allShipmentData));
            res.status(httpStatus.OK).json({
                success: true
            });
        } catch (err) {
            next(err);
        }
    },

    updateShipments (req,res,next) {
        try {
            // console.log('updateShipments');
            forEach (allShipmentData, (shipment) => {
                if (shipment.id == req.body.shipmentId) {
                    if (req.body.action == 'PICKED_UP') {
                        shipment['pickedOn'] = req.body.timestamp;
                    } else if (req.body.action == 'DELIVERED') {
                        shipment['deliveredOn'] = req.body.timestamp;
                    }
                    shipment['orderStatus'] = req.body.action;
                }
            });
            fs.writeFileSync(appDir + '/data/shipments-data.json', JSON.stringify(allShipmentData));
            res.status(httpStatus.OK).json({
                success: true
            });
        } catch (err) {
            next(err);
        }
    },
    
    getUsers(req,res,next) { 
        // console.log('getUsers');
        const allBikers = filter(allUsers, { role: 'BIKER' });
        const bikersData = [];
        forEach(allBikers, (value) => {
            bikersData.push(omit(value, ['password']));
        });
        try {
            res.status(httpStatus.OK).json({
                success: true,
                data: bikersData
            });
        } catch (err) {
            next(err);
        }
    }

};