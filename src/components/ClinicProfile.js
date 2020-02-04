import React from "react";
import axios from 'axios';
import { Form, Button, FormGroup, FormControl, ControlLabel,Card,Col } from "react-bootstrap";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { withRouter,useParams,Link} from "react-router-dom";
import { Redirect } from 'react-router-dom'
import '../css/ClinicProfile.css'
import icon from '../icons/klinika.svg';
import clinicprofileimage from '../icons/polymesh.jpg';
import doctors from '../icons/Career_3-01.jpg';
import clinicsicon from '../icons/doctor.svg';
import Select from 'react-select';
import "react-select/dist/react-select.css";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import matchSorter from "match-sorter";
import ClinicDoctorsTable from './ClinicDoctorsTable';
import AllDoctorsFromClinicTable from './AllDoctorsFromClinicTable.js';
import moment from 'moment';
import ShowPredef from './ShowPredef';
import StarRatings from 'react-star-ratings';

const ErrorSearch = withReactContent(Swal)

class  ClinicProfile extends React.Component{
  constructor(props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.handleChangeDate = this.handleChangeDate.bind(this);
      this.handleChangeResultFiltering = this.handleChangeResultFiltering.bind(this);
      this.FilterDocs = this.FilterDocs.bind(this);
      this.handleSelectChange = this.handleSelectChange.bind(this);
      this.renderExams = this.renderExams.bind(this);


      this.state =  {
          clinicname: '',
          adress : '',
          description: '',
          doctorsId: [],
          rating : '',
          doctors:[],
          filtered:[],
          examTypes:[],
          exam: props.match.params.examtype,
          date: props.match.params.date,
          time: props.match.params.time,
          name: props.match.params.name,
          startDate: new Date(),
          clinic:'',
          filter:'',
          startingdoctors:[],
          exams:[],
          select:undefined,
          startDate: new Date(),
          dateString:'',
          tempPredef:[],
          typesthathavepredef:[],
        }






      let token = localStorage.getItem('token');
      const options = {
          headers: { 'Authorization': 'Bearer ' + token}
      };

      axios.get(`http://localhost:8081/api/clinics/clinicabout/${this.props.match.params.name}`,options).then(
          (resp) => {
            this.changeState(resp)},
          (resp) => this.onErrorHandler(resp),
        );

        var exams=[];
        var doctorstemp=[];
        axios.get(`http://localhost:8081/api/doctors/aboutclinicdoctors/${this.props.match.params.name}`,options).then(
            (resp) => {
              if(this.props.match.params.date !==  undefined && this.props.match.params.date !==  undefined && this.props.match.params.time !==  undefined  ){
              console.log(resp.data);

              resp.data.map((doctor, index) => {


              if(doctor.examType.name.toLowerCase().includes(this.props.match.params.exam.toLowerCase())){

                var strint = doctor.start.toString().substring(0,2);
                var time = parseInt(strint);

                var strinte = doctor.end.toString().substring(0,2);
                var minutesend = doctor.end.toString().substring(3,5);
                var minutesendnumber = parseInt(minutesend);


                console.log(minutesend);
                var timeend = parseInt(strinte);
                var dur = parseInt(doctor.examType.duration);



                const hours = [];
                const events =[];


                var duration=0;


                for(let hour = time; hour <= timeend; hour++) {

                  if(hour == timeend && duration == parseInt(minutesendnumber)){

                    hours.push(
                        moment({
                            hour,
                            minute: duration
                        }).format('HH:mm:ss')
                    );
                    break;
                  }

                  hours.push(
                      moment({
                          hour,
                          minute: duration
                      }).format('HH:mm:ss')
                  );

                    duration = duration+dur;

                    if(duration >= 60){
                      duration = duration%60;
                    }else {
                      hour=hour-1;
                    }


                }



              var self = this;
              var actualhours=[];

              var brojac = 0;
              var godisnji = 0;


              doctor.appointments.forEach(function (appointment) {

                hours.forEach(function (term) {

                  if(appointment.date == self.props.match.params.date && appointment.startTime == term){

                    console.log("in if");
                    console.log(appointment);
                    console.log(appointment.status);
                    console.log(appointment.time);
                    brojac = brojac+1;

                    events.push(term);
                    hours.splice( hours.indexOf(term), 1 );


                  }

                });
              });

              if(doctor.holidays.lenght !== 0){

                  doctor.holidays.forEach(function (holiday) {


                    var stringdate =  holiday.fromto.split("-");
                    var wanteddate = self.props.match.params.date.split("-");
                    console.log(wanteddate);

                    var holidayEnd = new Date(stringdate[0],stringdate[1]-1,parseInt(stringdate[2].substring(0,2)),0,0,0);
                    var holidayStart = new Date(stringdate[3],stringdate[4]-1,parseInt(stringdate[5].substring(0,2)),0,0,0);
                    var wantedDate = new Date(wanteddate[0],wanteddate[1]-1,wanteddate[2],0,0,0);
                    //console.log(holidayStart);

                        console.log(holidayEnd)
                        console.log(holidayStart);
                        console.log(wantedDate);

                      if((wantedDate == holidayStart) || (wantedDate == holidayEnd) || (holidayStart < wantedDate < holidayEnd)){
                        godisnji= godisnji+1;
                      }

                  });

                }

                if(brojac == 0 && godisnji == 0)
                {

                  doctorstemp.push({holidays:doctor.holidays,events:events,gender:doctor.gender,exam:doctor.examType,id:doctor.id,name:doctor.name,lastname:doctor.lastname,rating:doctor.rating,appointments:doctor.appointments,start:doctor.start,end:doctor.end,hours:hours});
              }
            }

            });

            this.setState({
              doctors: doctorstemp,
              startingdoctors: doctorstemp,
              tempPredef : tempPredef,
            });
            console.log(this.state.doctors);
          }else{

            console.log(resp.data);
            var tempexams = [];
            var tempPredef =[];
            var actualtypes=[];
            var id =1;
            resp.data.map((doctor, index) => {

              var thisdoctorspredefs=[];

              doctor.appointments.map((a,index) => {

                if(a.classification == 'PREDEFINED' &&

                a.status !== 'HAS_HAPPEND' && a.status == 'SHEDULED'){

                  tempPredef.push(a.date+"|"+a.startTime+"|"+a.endTime+"|"+a.type.duration+"|"+a.type.name);

                  thisdoctorspredefs.push({id:a.id,startTime:a.startTime,endTime:a.endTime,date:a.date,room:a.roomNumber,
                  doctorfirstname:doctor.name,doctorlastname:doctor.lastname,type:a.type,doctorEmail:doctor.email,
                  start:a.start,status:a.status,classification:a.classification});

                }

              });

              console.log(thisdoctorspredefs);

            if(tempexams.indexOf(doctor.examType.name) == -1){
              tempexams.push(doctor.examType.name)
            }


              var strint = doctor.start.toString().substring(0,2);
              var time = parseInt(strint);

              var strinte = doctor.end.toString().substring(0,2);
              var timeend = parseInt(strinte);
              console.log(timeend);



              doctorstemp.push({patients:doctor.patients,predefs:thisdoctorspredefs,holidays:doctor.holidays,exam:doctor.examType,id:doctor.id,name:doctor.name,lastname:doctor.lastname,rating:doctor.rating,appointments:doctor.appointments,start:doctor.start,end:doctor.end});

            });

          this.setState({
            doctors: doctorstemp,
            startingdoctors: doctorstemp,
            exams:tempexams,
            tempPredef: tempPredef,
            typesthathavepredef : actualtypes,
          });

          console.log(this.state.tempPredef);

          }
        },
            (resp) =>this.onErrorHandler(resp));
      }





      onSuccessHandler(resp) {

        this.changeState(resp);
      }


      changeState = (resp) => {

                this.setState({
                    clinicname: resp.data.name,
                    adress :resp.data.adress,
                    description: resp.data.description,
                    doctorsId: resp.data.doctorsId,
                    rating: resp.data.rating,
                    clinic: resp.data,

        });

        console.log(this.state);



      }


      onErrorHandler(response) {
          alert("Error response: Uncovered case");
        }



       handleChange(e) {
             this.setState({...this.state, [e.target.name]: e.target.value});

         }


handleChangeDate = date => {


               var dateString =date.toISOString().substring(0,10);
               console.log(dateString);

                this.setState({
                  startDate: date,
                  dateString:dateString,

                });


            }

  handleSelectChange = entry => {

      var self = this;


        if(entry== null){
          this.setState({
            select: undefined,
        });
      }

      else{

        this.setState({ select: entry.value});
    }
  }


    FilterDocs(){

      if(this.state.select == undefined || this.state.dateString == ''){

        ErrorSearch.fire({
            title: "You didnt enter date or you didn't select exam type so we can't filter.Please try again.",
            text: '',
            type: "error",
            button: true,
            icon: "error"
          });

       return;

      }


      var self = this;

      var returnDoctors =[];

      console.log(this.state.dateString);


      this.state.startingdoctors.forEach(function (doctor) {

        var tempPredef =[];
        var thisdoctorspredefs=[];

        if(doctor.exam.name == self.state.select){
          console.log("same exam");

          var strint = doctor.start.toString().substring(0,2);
          var time = parseInt(strint);

          var strinte = doctor.end.toString().substring(0,2);
          var timeend = parseInt(strinte);

          var minutesend = doctor.end.toString().substring(3,5);
          var minutesendnumber = parseInt(minutesend);

          var timeend = parseInt(strinte);
          var dur = parseInt(doctor.exam.duration);
          const hours = [];
          var duration=0;
          var events=[];

          for(let hour = time; hour <= timeend; hour++) {

            if(hour == timeend && duration == parseInt(minutesendnumber)){

              hours.push(
                  moment({
                      hour,
                      minute: duration
                  }).format('HH:mm:ss')
              );
              break;
            }

            hours.push(
                moment({
                    hour,
                    minute: duration
                }).format('HH:mm:ss')
            );

              duration = duration+dur;

              if(duration >= 60){
                duration = duration%60;
              }else {
                hour=hour-1;
              }


          }

            console.log("paased making terms");

            console.log(doctor);
            console.log(self.state.dateString);


            doctor.appointments.forEach(function (appointment) {
              hours.forEach(function (term) {


              if(appointment.date == self.state.dateString && appointment.startTime == term &&
                (appointment.status == 'SHEDULED'|| appointment.status =='HAPPENING' || appointment.classification == 'PREDEFINED')){


                hours.splice( hours.indexOf(term), 1 );
                events.push(term);
                console.log("thinks they are same");


              }

            });

            });

            var godisnji = 0;
            console.log(doctor);
            if(doctor.holidays.lenght !== 0){

                doctor.holidays.forEach(function (holiday) {


                  var stringdate =  holiday.fromto.split("-");
                  var wanteddate = self.state.dateString.split("-");
                  console.log(wanteddate);

                  var holidayEnd = new Date(stringdate[0],stringdate[1]-1,parseInt(stringdate[2].substring(0,2)),0,0,0);
                  var holidayStart = new Date(stringdate[3],stringdate[4]-1,parseInt(stringdate[5].substring(0,2)),0,0,0);
                  var wantedDate = new Date(wanteddate[0],wanteddate[1]-1,wanteddate[2],0,0,0);
                  //console.log(holidayStart);

                      console.log(holidayEnd)
                      console.log(holidayStart);
                      console.log(wantedDate);

                    if((wantedDate == holidayStart) || (wantedDate == holidayEnd) || (holidayStart < wantedDate < holidayEnd)){
                      godisnji= godisnji+1;
                    }

                });

              }


            if(godisnji == 0){
          returnDoctors.push({godisnji:godisnji,exam:doctor.exam,id:doctor.id,
          name:doctor.name,lastname:doctor.lastname,
          rating:doctor.rating,appointments:doctor.appointments,start:doctor.start,end:doctor.end,hours:hours,events:events});
        }

        }

      });


      this.setState({
        doctors: returnDoctors

      });

    }


  handleChangeResultFiltering(e) {

           this.setState({...this.state, [e.target.name]: e.target.value});

           if(e.target != undefined){
           console.log(e.target.value);
         }

         console.log(this.state.dateString);
         console.log(this.state.select);
         console.log(this.state.doctors);

         if(document.getElementsByName("filter")[0].value ==''){
          if(this.state.select == undefined || this.state.dateString == ''){
            console.log("thinks hes here");
         this.setState({
           doctors: this.state.startingdoctors,
         });
         return;
       }else{
         console.log("in gere");
         if(this.state.select != undefined && this.state.dateString != ''){
         this.FilterDocs();
         return;
       }
       }
       }

         var resultingdoctors =[];
         var doctorsName=[];
         var doctorsLastname=[];
         var doctorsRating=[];
         var doctorsFirstAndLastName=[];

         var trywholename=false;

         var firstandlast = e.target.value.split(/ (?!\|)/);
         if( firstandlast !== undefined && firstandlast[0] !== undefined && firstandlast[1] !== undefined){
           trywholename=true;
         }

         this.state.doctors.forEach(function (arrayItem) {

           if(arrayItem.name.toLowerCase().includes(e.target.value.toLowerCase())){
             doctorsName.push(arrayItem);
         }

         if(arrayItem.lastname.toLowerCase().includes(e.target.value.toLowerCase())){
           doctorsLastname.push(arrayItem);
       }

        if(trywholename){
       if(arrayItem.lastname.toLowerCase().includes(firstandlast[1].toLowerCase()))
        if(arrayItem.name.toLowerCase().includes(firstandlast[0].toLowerCase())){
         {doctorsFirstAndLastName.push(arrayItem);}
     }
   }

       if(arrayItem.rating.toString().startsWith(e.target.value)){
           doctorsRating.push(arrayItem);
     }

     console.log(doctorsFirstAndLastName);
 });


     resultingdoctors = doctorsName;

       doctorsLastname.forEach(function (arrayItem) {

         if(resultingdoctors.some(x=>x.id == arrayItem.id)){
           return;
         }else{
           resultingdoctors.push(arrayItem);
         }

       });

       doctorsFirstAndLastName.forEach(function (arrayItem) {

         if(resultingdoctors.some(x=>x.id == arrayItem.id)){
           return;
         }else{
           resultingdoctors.push(arrayItem);
         }

       });


       doctorsRating.forEach(function (arrayItem) {

         if(resultingdoctors.some(x=>x.id == arrayItem.id)){
           return;
         }else{
           resultingdoctors.push(arrayItem);
         }

       });


       this.setState({

         doctors: resultingdoctors,

       });


       }


       renderExams(){


          return this.state.exams.map((exam, indexexam) => {

           var thistypepredfs = [];
           var brojac=0;
           var info;

           this.state.startingdoctors.map((doc,indexpredef)=>{
             console.log(doc);
             if(doc.predefs !== undefined){
               console.log(doc.predefs);

            doc.predefs.map((predef,indexpredef)=>{

             if(predef.type.name == exam){

               thistypepredfs.push(predef);
               brojac=brojac+1;
             }

           });

         }
        });

           console.log(thistypepredfs);

           if(brojac == 0){
             return (<div></div>);
           }else{

             console.log(info);
             return (<ShowPredef exam={exam} exams={thistypepredfs}/>)
           }
           });

         }

//return (<ShowPredef exam={exam} exams={thistypepredfs}/>);

      render() {
        console.log(this.props.match.params.date);

          if(this.props.match.params.date != undefined && this.props.match.params.time != undefined && this.props.match.params.exam != undefined){

          return(
            <div className="back" >
            <input className="filter" name="filter" placeholder="Enter name,lastname or doctors rating." onChange={this.handleChangeResultFiltering}></input>
            <div className="nesto">
                        <br />
                        <ClinicDoctorsTable content={this.state.doctors} date={this.props.match.params.date}/>
                        <br />
            </div>

            </div>

          );
        }else if (this.props.match.params.date == undefined && this.props.match.params.time == undefined && this.props.match.params.exam == undefined && this.props.match.params.name !== undefined){

          console.log(this.state.dateString);
          console.log(this.state.rating);

          return(


            <div className="back1" style={{top:'0', bottom:'0', left:'0', right:'0', position: 'absolute'}}>

            <div className="parametri">

            <h1 className="nazivklinike1">{this.state.clinicname}

            <h1>
            <StarRatings
              rating={this.state.clinic.rating}
              starRatedColor="blue"
              numberOfStars={5}
              name='rating'
              starHoverColor ='rgb(52, 174, 235)'
              isAggregateRating= 'true'
              starRatedColor= 'rgb(55, 146, 191)'
              starDimension='25px'
              svgIconPath="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
	c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"
              svgIconViewBox="0 0 32 29.6"
            />
            </h1>


            </h1>


            <input className="filter1" name="filter" placeholder="Enter name,lastname or doctors rating." onChange={this.handleChangeResultFiltering}></input>

            <br/>
            <DatePicker
                 selected={ this.state.startDate}
                 onChange={this.handleChangeDate}
                 value= {this.state.inputValue}
                 name="startDate"
                 className="datepickerClinicProfile"
                 minDate={moment().toDate()}


               />
             <div className="type">

             <Select
             options={
              this.state.exams.map((type, i) => {
              return {id: i,value:type, label: type};
               })
             }
             onChange ={this.handleSelectChange}
             value={this.state.select}
             className="type"
             required
             placeholder="Select exam type"
              />

              </div>
              <Button className="buttonForFiltering" variant="light" onClick={this.FilterDocs}>Filter</Button>
              <br/>
              <label className="explanation"> Pick a date and exam type and see avaliable terms.
              </label>
              <br/>
              <div className="tipovipredef">
              <h4 className="naslovtipovapred">See this clinic's predefined appointments</h4>
              <label></label>
              {this.renderExams()}
              </div>
              </div>
            <Card className="karticadoktora">

              <div className="prostorneki"></div>
                        <br />
                        <AllDoctorsFromClinicTable content={this.state.doctors} date={this.state.dateString} user={this.props.user}/>
                        <br />
            </Card>

            </div>



          );
        }
      }

  }



  export default withRouter(ClinicProfile);
