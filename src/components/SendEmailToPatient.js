import React from "react";
import {Route, withRouter, Switch } from "react-router-dom";
import axios from 'axios';
import { Form, DropdownButton, Button, ControlLabel, Dropdown,Card } from "react-bootstrap";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../css/ScheduleAppointment.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const RequestSent = withReactContent(Swal)

class SendEmailToPatinet extends React.Component{
    constructor(props){
        super(props);

        this.sendRequest = this.sendRequest.bind(this);

        this.state = {

          date:'',
          starttime:'',
          endtime: '',
          doctorEmail:'',
          patient: ''
        }

    }

    componentDidMount(){


      this.setState({

        date: this.props.match.params.date,
        starttime : this.props.match.params.startime,
        doctorEmail : this.props.match.params.doctoremail,
        endtime : this.props.match.params.endtime,
        patient : this.props.match.params.id,
      });


    }

    sendRequest = event => {
       event.preventDefault();

       console.log(this.state);

       let token = localStorage.getItem('token');
       const options = {
           headers: { 'Authorization': 'Bearer ' + token}
       };


         if(this.props.match.params.date == '' || this.props.match.params.startime == undefined || this.props.match.params.id == undefined
       || this.props.match.params.endtime == undefined || this.props.match.params.doctoremail == undefined){



           RequestSent.fire({
               title: "error",
               text: '',
               type: "error",
               button: true
             });

          return;

         }

       var obj ={

          date: this.props.match.params.date,
          startime : this.props.match.params.startime,
          doctorEmail: this.props.match.params.doctoremail,
          patient: this.props.match.params.id,
          endtime: this.props.match.params.endtime


       }

        axios.post(`http://localhost:8081/api/appointmentrequest/sendrequest/${this.state.doctorEmail}/${this.state.date}/${this.state.starttime}/${this.state.endtime}/${this.state.patient}`,obj,options).then(
          (resp) => {

            RequestSent.fire({
                title: "Request for appointment sent successfully",
                type: 'success',
                icon: 'success'
              });

              document.getElementById("requestbutton").style.visibility = "hidden";
              document.getElementById("time").remove();
              document.getElementById("date").remove();
              document.getElementById("price").remove();
              document.getElementById("labelftersending").style.visibility = "visible";
              document.getElementById("labelftersending").style.margin = "-150px 0px 0px 0px";

        },
          (resp) =>{

            RequestSent.fire({
                title: "Request for appointment failed to send ",
                text: "Please try again",
                type: 'error',
                icon: 'error'
              });

          }
        );



    }


    render() {
      console.log(this.props.user);

        return(

              <div className="behind"style={{top:'0', bottom:'0', left:'0', right:'0', position: 'absolute'}}>
              <Card className="pregledCardContainer" style={{width:'370px',height:'330px',left:'100px',top:'50px',backgroundcolor: 'rgba(245, 245, 245, 0.4)!important'}}>
              <Card.Title className="pregledcardTitle"></Card.Title>


                  <Card.Body className = "pregledcardBody">
                  <Card.Text className='pregledcardText'>
                      <label className="appointmentdate" id="date"><b>Appointment date </b> {this.props.match.params.date}</label>
                      <br/>
                      <label className="appointmenttime" id="time"><b>Appointment time </b> {this.props.match.params.startime}</label>
                      <br/>
                      <label className="appointmentprice" id="price"><b>Appointment end time </b>{this.props.match.params.endtime}</label>
                      <br/>
                      <Button className="sendrequestbutton" variant="secondary" id="requestbutton" onClick={this.sendRequest}>Make a request for this appointment</Button>
                      <label id="labelftersending" style={{visibility:'hidden'}}>
                      Great! Your request for this appointment is sent to the patient.
                      </label>
                      </Card.Text>
                      <div className="pregledCardAdd">
                      </div>


                  </Card.Body>
              </Card>
              </div>


        )
    }
}

export default withRouter(SendEmailToPatinet);
