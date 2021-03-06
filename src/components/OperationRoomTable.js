import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Modal, Button, Card } from "react-bootstrap";
import hospitalicon from '../icons/hospital.svg'


const DoctorDeletedAlert = withReactContent(Swal)
class OperationRoomTable extends React.Component {
    constructor(props) {
        super(props);

        this.renderTableData = this.renderTableData.bind(this);
    }

    deleteRoom(room) {

        let token = localStorage.getItem('token');
        const options = {
            headers: { 'Authorization': 'Bearer ' + token}
        };

        //console.log(doctor.email);

         axios.post("http://localhost:8081/api/rooms/deleteroom", room, options).then(
             console.log(room),
             (resp) => this.onSuccessHandler(resp),
             (resp) => this.onErrorHandler(resp)
         );
    }

    onErrorHandler(resp) {
      console.log("error");
      alert("error");

    }

    onSuccessHandler(resp) {
        window.location.reload();
    }

    renderTableData() {
        return this.props.content.map((room, index) => {
            const { name, number, isReserved} = room
    
            return (
                <Card key={name} className="cardContainerDoctor" >
                <Card.Img style={{height:'130px', width: 'auto'}} className="userIcon" variant="top" src={hospitalicon} alt='Unavailable icon' />
                    <Card.Body className = "cardBody">
                        <Card.Title className="cardTitle" >{name}</Card.Title>
                        <Card.Text className='cardText'>
                            
                               Number: {number}
                               <br/>
                               Reserved: {isReserved}
                               <br/>
                            
                        </Card.Text>
                        <Button className="deleteRoom" variant="success" onClick={this.deleteRoom.bind(this, room)} >Delete</Button>
    
                    </Card.Body>
                </Card>
                )
            })
        }
    
        render() {
            return (
                <div className="rendercardsdoctor">
                    {this.renderTableData()}
                </div>
            )
    
        }
}
export default OperationRoomTable;
