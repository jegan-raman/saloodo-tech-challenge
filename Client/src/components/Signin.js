import Button from '@material-ui/core/Button';
// redux action
import { signInWithEmailAndPassword } from 'Actions';
// app config
import AppConfig from 'Constants/AppConfig';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup } from 'reactstrap';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';


class Signin extends Component {

   state = {
      email: '',
      password: ''
   }
   
   /**
    * On User Login
    */
   onUserLogin = () => {
      if (this.state.email !== '' && this.state.password !== '') {
         // console.log(this.state);
         this.props.signInWithEmailAndPassword(this.state, this.props.history);
      }
   }

   /**
    * Render the page
    */
   render() {
      const { email, password } = this.state;
      return (
         <div className="session-inner-wrapper">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-sm-12 col-md-8 col-lg-6">
                     <div className="session-body text-center mt-5 pt-5">
                        <div className="session-head mb-5">
                           <h2 className="font-weight-bold">Login</h2>
                        </div>
                        <ValidatorForm ref="form" onSubmit={this.onUserLogin} autoComplete='off'>
                           <FormGroup className="has-wrapper">
                              <TextValidator id='email' fullWidth variant='outlined' label='Email Address' value={email} onChange={(event) => this.setState({ email: event.target.value })} validators={['required', 'isEmail']} errorMessages={['This field is required', 'Enter valid email']} />
                              <span className="has-icon"><i className="ti-email"></i></span>
                           </FormGroup>
                           <FormGroup className="has-wrapper">
                              <TextValidator type = "password" id='password' fullWidth variant='outlined' label='Password' value={password} onChange={(event) => this.setState({ password: event.target.value })} validators={['required']} errorMessages={['This field is required']} />
                              <span className="has-icon"><i className="ti-lock"></i></span>
                           </FormGroup>
                           <FormGroup className="mb-15">
                              <Button
                                 color="primary"
                                 className="btn-block text-white w-100 big-btn"
                                 variant="contained"
                                 size="large"
                                 type = "submit"
                                 >
                                 Sign In
                              </Button>
                           </FormGroup>
                        </ValidatorForm>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

// map state to props
const mapStateToProps = ({ authUser }) => {
   const { user } = authUser;
   return { user }
}

export default connect(mapStateToProps, {
   signInWithEmailAndPassword
})(Signin);
