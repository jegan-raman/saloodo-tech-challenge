import React, { Component } from 'react';
import { MenuItem } from '@material-ui/core';
import MatButton from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { GetShipmentList, GetUserList, signOutUser, AssignShipment, UpdateShipment, GetDashboardReports } from 'Actions';
import AppConfig from 'Constants/AppConfig';
//Pagination Component
import PaginationComponent from "react-reactstrap-pagination";
import { keyBy, forEach } from 'lodash';
import { Auth } from 'Util';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import moment from 'moment';

class ShipementList extends Component {
    state = {
        pageno: 1,
        shipmentData: {
            count: 0,
            rows: []
        },
        dashboardData: {

        },
        userList: [],
        loggedUser: Auth.getUser(),
        assigneeFormData: {
            shipmentId: '',
            assignee: ''
        },
        pickupDeliverFormData: {
            shipmentId: '',
            timestamp: ''
        },
        selectedShipment: null,
        todayDate: moment().format('YYYY-MM-DDThh:mm')
    };

    componentWillMount = () => {
        const { loggedUser } = this.state;
        if (loggedUser.role == 'MANAGER') {
            this.getDashboardReports();
        }
        this.getShipmentList(1);
        this.getUserList();
    }

    componentDidMount = () => {
    
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.shipmentData) {
            this.setState({ shipmentData: nextProps.shipmentData.data })   
        }

        if (nextProps.userList) {
            this.setState({ userList: nextProps.userList.data });  
        }

        if (nextProps.dashboardReports) {
            this.setState({ dashboardData: nextProps.dashboardReports.data });  
        }
    }

    /**
    * Get Dashboard Reports
    */
    getDashboardReports = () => {
        this.props.GetDashboardReports();
    }

    /**
    * Get Shipment List 
    */

    getShipmentList = (page) => {
        this.setState({ pageno: page });
        const queryParmas = {
            page: page
        }  
        if (Auth.isBiker()) {
            const userId = Auth.getUserId();
            queryParmas['userId'] = userId;
        }
        // console.log('queryParmas', queryParmas);
        this.props.GetShipmentList(queryParmas, true);
    }

    /**
    * Get Users List 
    */

    getUserList = () => {
        this.props.GetUserList();
    }

    /**
	 * Logout User
	 */
	logoutUser() {
		this.props.signOutUser();
    }
    

    /**
    * Open Dialog View to Assign
    */
    openAssigneeForm(shipment) {
        this.setState({ 
            showAssigneeDialog: true, 
            assigneeFormData: {
                shipmentId: shipment.id,
                assignee: ''
            }
        });
    }

    /**
     * Close Assignee Form
     */
    closeAssigneeForm() {
        this.setState({ 
            showAssigneeDialog: false, 
            assigneeFormData: {
                shipmentId: '',
                assignee: ''
            } 
        });
    }

    /**
     * Hanlde Field Change for Assignee Form
     */
    handleAssigneeFormChange = (field) => (event) => {
        const { assigneeFormData } = this.state;
        assigneeFormData[field] = event.target.value;
        this.setState({ assigneeFormData });
    }

    handleAssigneeSubmit = () => {
        const { assigneeFormData, shipmentData, userList } = this.state;
        const userObj = keyBy(userList, 'id');
        this.props.AssignShipment(assigneeFormData);
        forEach(shipmentData.rows, (shipment) => {
            if (shipment.id == assigneeFormData['shipmentId']) {
                shipment['assignee'] = assigneeFormData['assignee'];
                shipment['orderStatus'] = "ASSIGNED";
                shipment['assigneeDetails'] = userObj[assigneeFormData['assignee']];
            }
        });
        this.setState({ shipmentData });
        this.closeAssigneeForm();
    }

    /**
    * Open Dialog View to Pickup Or Deliver
    */
    openPickupDeliverForm(shipment, action) {
        this.setState({ 
            showPickupDeliverDialog: true, 
            pickupDeliverFormData: {
                shipmentId: shipment.id,
                timestamp: '',
                action: action
            }
        });
    }

    /**
     * Close Pickup or Deliver Form
     */
    closePickupDeliverForm() {
        this.setState({ 
            showPickupDeliverDialog: false, 
            pickupDeliverFormData: {
                shipmentId: '',
                timestamp: ''
            } 
        });
    }

    /**
     * Hanlde Field Change for Pickup or Deliver Form
     */
    handlePickupDeliverFormChange = (field) => (event) => {
        const { pickupDeliverFormData } = this.state;
        pickupDeliverFormData[field] = event.target.value;
        this.setState({ pickupDeliverFormData });
    }

    handlePickupDeliverSubmit = () => {
        const { pickupDeliverFormData, shipmentData } = this.state;
        this.props.UpdateShipment(pickupDeliverFormData);
        // console.log('pickupDeliverFormData', pickupDeliverFormData);
        forEach(shipmentData.rows, (shipment) => {
            if (shipment.id == pickupDeliverFormData['shipmentId']) {
                shipment['orderStatus'] = pickupDeliverFormData['action'];
                if (pickupDeliverFormData['action'] == 'PICKED_UP') {
                    shipment['pickedOn'] = pickupDeliverFormData['timestamp'];
                } else {
                    shipment['deliveredOn'] = pickupDeliverFormData['timestamp'];
                }
            }
        });
        this.setState({ shipmentData });
        this.closePickupDeliverForm();
    }

    /**
    * Render the page
    */
    render() {
        const { shipmentData = {}, userData = {}, loggedUser = {}, assigneeFormData = {}, userList = [], pickupDeliverFormData = {}, todayDate = '', dashboardData = {} } = this.state;
        const shipmentCount = shipmentData.count;
        const shipmentList = shipmentData.rows;
        return (
            <div className="shipments-container">
                <div className = "row">
                    <div className = "col-lg-12 col-md-12 col-sm-12">
                        <div className = "header-title">
                            <h3>{loggedUser.role == 'MANAGER' ? 'Dashboard' : 'Shipment List'}</h3>
                            <span className = "user-info">
                                <ul>
                                    <li><b>Welcome, {loggedUser.username}</b></li>
                                    <li>
                                        <a href="" onClick={() => this.logoutUser()}>
                                            Log Out
                                        </a>
                                    </li>
                                </ul>
                            </span>
                        </div>
                    </div>
                </div>
                {
                    loggedUser.role == 'MANAGER' && 
                    <div className = "row">
                        <div className = "col-lg-12 col-md-12 col-sm-12">
                            <div className = "row mb-5">
                                <div className = "col-lg-3 col-md-3 col-sm-6">
                                    <div className="card text-white bg-primary mb-3">
                                        <div className="card-header">TOTAL SHIPMENTS</div>
                                        <div className="card-body">
                                            <h5 className="card-title">{dashboardData.TOTAL || 0}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className = "row mb-5">
                                <div className = "col-lg-3 col-md-3 col-sm-6">
                                    <div className="card text-white bg-success mb-3">
                                        <div className="card-header">DELIVERED SHIPMENTS</div>
                                        <div className="card-body">
                                            <h5 className="card-title">{dashboardData.DELIVERED || 0}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className = "col-lg-3 col-md-3 col-sm-6">
                                    <div className="card text-white bg-warning mb-3">
                                        <div className="card-header">ASSIGNED SHIPMENTS</div>
                                        <div className="card-body">
                                            <h5 className="card-title">{dashboardData.ASSIGNED || 0}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className = "col-lg-3 col-md-3 col-sm-6">
                                    <div className="card text-white bg-info mb-3">
                                        <div className="card-header">PICKED UP SHIPMENTS</div>
                                        <div className="card-body">
                                            <h5 className="card-title">{dashboardData.PICKED_UP || 0}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className = "col-lg-3 col-md-3 col-sm-6">
                                    <div className="card text-white bg-danger mb-3">
                                        <div className="card-header">WAITING SHIPMENTS</div>
                                        <div className="card-body">
                                            <h5 className="card-title">{dashboardData.WAITING || 0}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <div className = "row">
                    {
                        loggedUser.role == 'MANAGER' && 
                        <div className = "col-lg-12 col-md-12 col-sm-12 mb-3">
                            <h4>Shipment List</h4>
                        </div>
                    }
                    <div className = "col-lg-12 col-md-12 col-sm-12">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>origin</th>
                                        <th>destination</th>
                                        <th>assignee</th>
                                        <th>status</th>
                                        <th>action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shipmentList && shipmentList.map((shipment, key) => (
                                        <tr key = {key}>
                                            <td>
                                                { ((this.state.pageno -1 ) * (AppConfig.tables.queryLimit)) + (key + 1)}
                                            </td>
                                            <td className = "text-capitalize">
                                                {shipment.origin}
                                            </td>
                                            <td className = "text-capitalize">
                                                {shipment.destination}
                                            </td>
                                            <td className = "text-capitalize">
                                                {shipment.assigneeDetails ? shipment.assigneeDetails['username'] : '-'}
                                            </td>
                                            <td className = "text-capitalize">
                                                {shipment.orderStatus}
                                            </td>
                                            <td className = "text-center">
                                                {
                                                    shipment.orderStatus == 'WAITING' && loggedUser.role == 'MANAGER' &&
                                                    <button className = "btn btn-success" onClick={() => this.openAssigneeForm(shipment)}>Assign</button>
                                                } 

                                                {
                                                    shipment.orderStatus == 'ASSIGNED' && loggedUser.role == 'BIKER' &&
                                                    <button className = "btn btn-success" onClick={() => this.openPickupDeliverForm(shipment, 'PICKED_UP')}>Pickup</button>
                                                } 

                                                {
                                                    shipment.orderStatus == 'PICKED_UP'  && loggedUser.role == 'BIKER' &&
                                                    <button className = "btn btn-success" onClick={() => this.openPickupDeliverForm(shipment, 'DELIVERED')}>Deliver</button>
                                                } 

                                                {
                                                    shipment.orderStatus && shipment.orderStatus == 'PICKED_UP' &&
                                                    <p className = "timestamp">
                                                        Picked On <br />
                                                        {moment(shipment.pickedOn).format('YYYY-MM-DD hh:mm A')}
                                                    </p>
                                                }
                                                {
                                                    shipment.orderStatus && shipment.orderStatus == 'DELIVERED' && 
                                                    <p className = "timestamp">
                                                        Delivered On <br />
                                                        {moment(shipment.deliveredOn).format('YYYY-MM-DD hh:mm A')}
                                                    </p>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className = "pagination-container">
                            <span className = {!(shipmentList && shipmentList.length) ? 'none' : 'table-pagination'}>
                                <PaginationComponent
                                    totalItems={shipmentCount || 0}
                                    pageSize={AppConfig.tables.queryLimit}
                                    onSelect={this.getShipmentList}
                                    maxPaginationNumbers={AppConfig.tables.maxPaginationNumbers}
                                    activePage={this.state.pageno}
                                />
                            </span>
                            
                            {   
                                shipmentList && !shipmentList.length && 
                                <p className = "text-center">No Results Found</p>
                            }
                        </div>
                    </div>
                </div>
                <Modal isOpen={this.state.showAssigneeDialog} toggle={() => this.closeAssigneeForm()}>
                    <ValidatorForm ref="form" onSubmit={this.handleAssigneeSubmit} autoComplete='off'>
                        <ModalHeader toggle={() => this.closeAssigneeForm()}>
                            Assign
                        </ModalHeader>
                        <ModalBody>
                            <div className='form-group'>
                                <TextValidator id='assignee' select SelectProps={{ classes: { select: 'selectBox' } }} label='Assignee'
                                    value={assigneeFormData.assignee}
                                    onChange={this.handleAssigneeFormChange('assignee')}
                                    fullWidth variant='outlined' validators={['required']} errorMessages={['This field is required']} >
                                    {userList && userList.map(option => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.username}
                                        </MenuItem>
                                    ))}
                                </TextValidator>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                           <MatButton variant="contained" type="submit" color="primary" className="text-white" > 
                                Submit
                           </MatButton>
                           <MatButton variant="contained" className="text-white btn-secondary" onClick={() => this.closeAssigneeForm()}>
                                Cancel
                           </MatButton>
                        </ModalFooter>
                    </ValidatorForm>
                </Modal>
                <Modal isOpen={this.state.showPickupDeliverDialog} toggle={() => this.closePickupDeliverForm()}>
                    <ValidatorForm ref="form" onSubmit={this.handlePickupDeliverSubmit} autoComplete='off'>
                        <ModalHeader toggle={() => this.closePickupDeliverForm()}>
                            Update Status
                        </ModalHeader>
                        <ModalBody>
                            <div className='form-group'>
                                <TextValidator type = "datetime-local" id='name' fullWidth label='Timestamp' value={pickupDeliverFormData.timestamp} onChange={this.handlePickupDeliverFormChange('timestamp')} variant='outlined' validators={['required']} errorMessages={['This field is required']} InputProps={{ inputProps: { max: todayDate } }} />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                           <MatButton variant="contained" type="submit" color="primary" className="text-white" > 
                                Submit
                           </MatButton>
                           <MatButton variant="contained" className="text-white btn-secondary" onClick={() => this.closePickupDeliverForm()}>
                                Cancel
                           </MatButton>
                        </ModalFooter>
                    </ValidatorForm>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = ({ shipmentReducer, userReducer }) => {
    const shipmentData = shipmentReducer.shipmentList;
    const dashboardReports = shipmentReducer.dashboardReports;
    const { userList }  = userReducer;
    return { 
        shipmentData, userList, dashboardReports
    };
};

export default connect(mapStateToProps, {
    GetShipmentList, GetUserList, signOutUser, AssignShipment, UpdateShipment, GetDashboardReports
})(ShipementList);