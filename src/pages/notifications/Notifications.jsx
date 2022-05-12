import './notifications.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, query, collection, where, getDocs, limit} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const Notifications = () => {

    const [notifications, setNotifications] = useState([]);
    const db = getFirestore();
    const auth = getAuth();
    const navigate = useNavigate();


    const Notif = ({notif}) => {
        return(
            <>
                <br />
                <div className="thought" onClick = {()=>navigate("/profile/" + notif.data().author)}>
                    <img src = {notif.data().photoURL} alt = "profile" className="profile-pic"/>
                    <div className='thought-page'>
                        <h3>{notif.data().name} {notif.data().message}</h3>
                    </div>
                </div>
            </>
           
        )
    }

    useEffect(() => {
        const getNotifications = async () => {
            const q = query(collection(db, "notifications"), where("to", "==", auth.currentUser.uid), limit(10));
            const querySnapshot = await getDocs(q);
            let tempArray = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                tempArray.push(doc);
            });

            tempArray = tempArray.sort((a, b) => {
                return new Date(b.data().createdAt) - new Date(a.data().createdAt);
            });
            setNotifications(tempArray);
        }
        getNotifications();
    }, [])

    return ( 
        <>
            <div className="notifications-container">
                <div className="header">
                    <h4>Notifications</h4>
                </div>
                <br />
                <br />
                <br />

                {
                    notifications.length > 0 ?
                    <>
                        {
                            notifications.map((notification, index) => {
                                return <Notif key={index} notif={notification} />
                            })
                        }
                    </>
                    :
                    <center className="no-notifications">
                        <h4>No notifications</h4>
                    </center>
                }
                
            </div>


        </>
     );
}
 
export default Notifications;