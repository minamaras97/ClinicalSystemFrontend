import React from 'react'
import AddClinicalCentreAdmin from './AddClinicalCentreAdmin';
import ClinicalCentreAdminTable from './ClinicalCentreAdminTable';
import '../css/ClinicalCentreAdminPage.css'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { withRouter } from "react-router-dom";
import { Card, Form } from 'react-bootstrap';
import CCAdminCardInfo from './CCAdminCardInfo'


class ClinicalCentreAdminPage extends React.Component{

    constructor(props) {
        super(props);
        this.state =  {
            ccadmins: []
        }

        this.addClinicalCentreAdmin = this.addClinicalCentreAdmin.bind(this);

        let token = localStorage.getItem('token');
        const options = {
            headers: { 'Authorization': 'Bearer ' + token}
        };

        axios.get("http://localhost:8081/api/clinicalcentreadmins/all",options).then(
            (resp) => this.onSuccessHandlerccAdmin(resp),
            (resp) => this.onErrorHandlerccAdmin(resp)
        );
    }


    addClinicalCentreAdmin(ccadmin) {
        this.setState(prevState => ({
            ccadmins: [...prevState.ccadmins, ccadmin]
        }));
    }

    onSuccessHandlerccAdmin(resp) {
        var tempccAdmins = [];

        for (var i = 0; i < resp.data.length; i++) {
            tempccAdmins.push(resp.data[i]);
        }
        this.setState({
            ccadmins: tempccAdmins
        });
    }

    onErrorHandlerccAdmin(response) {
        alert("Error response: Uncovered case");
    }



    render() {
        return (
            <div className="container-cca">
                <h1 className="adminTitle">Hi, {this.props.user.name}!</h1>
                <div className="row-cca">
                   
                    <div className="col-md-2-cca">                       
                        <CCAdminCardInfo content={this.props.user} />
                    </div>

                    <div className="col-md-10-cca">                     
                        <AddClinicalCentreAdmin className="btnAdm" />
                        <br/>
                        <br/>
                        <ClinicalCentreAdminTable content={this.state.ccadmins} />
                    </div>
                </div>
            </div>
        );
    }

}

export default withRouter(ClinicalCentreAdminPage);
