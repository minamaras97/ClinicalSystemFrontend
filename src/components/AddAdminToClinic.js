import React from 'react'
import ClinicAdminForm from './ClinicAdminForm'
import axios from 'axios';
import { Modal, Button, ListGroup } from "react-bootstrap";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../css/AddAdminToClinic.css';

const AdminConnectedAlert = withReactContent(Swal)

class ClinicAdminTable extends React.Component{
    constructor(props) {
        super(props);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
            clinicadmins: [],
        }

        //this.renderData = this.renderData.bind(this);

        axios.get("http://localhost:8081/api/clinicadmin/available").then(
            (resp) => this.onSuccessHandlerClinicAdmin(resp),
            (resp) => this.onErrorHandlerClinicAdmin(resp)
        );
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    onSuccessHandlerClinicAdmin(resp) {
        var tempClinicAdmins = [];

        for (var i = 0; i < resp.data.length; i++) {
            tempClinicAdmins.push(resp.data[i]);
        }
        this.setState({
            clinicadmins: tempClinicAdmins
        });
    }

    onErrorHandlerClinicAdmin(response) {
        alert("Error response: Uncovered case");
    }

    renderData(){
        return this.state.clinicadmins.map((clinicadmin, index) => {
            const { name, lastname, email, password} = clinicadmin

            return(
                <ListGroup key={email.toString()} >
                    <ListGroup.Item className="listButton" onClick={this.adminClicked.bind(this, clinicadmin)}>{name} (email:  {email})</ListGroup.Item>
                </ListGroup>

            )
        })
    }
    

    render() {
        return (
            <div>
            <Button id="adminadding" onClick={this.handleShow}>
                    Choose Admin
                </Button>
                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered = "true"
                >
                <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Available admins
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.renderData()}
                    
                </Modal.Body>
                <Modal.Footer>
                    
                    <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                </Modal.Footer>
                </Modal>
                </div>
        );
    }

    adminClicked(clinicadmin){
        axios.post(`http://localhost:8081/api/clinics/connectadmin/${this.props.id}`,clinicadmin).then(
            console.log(clinicadmin),
            console.log(this.props.id),
            this.handleClose(),
            (resp) => this.onSuccessHandler(resp),
            (resp) => this.onErrorHandler(resp),
            window.location.reload()
          );

    }

    onErrorHandler(resp) {
        alert("Error response: Uncovered case");
    }

    onSuccessHandler(resp){
        window.location.reload();
    }





}

export default ClinicAdminTable
