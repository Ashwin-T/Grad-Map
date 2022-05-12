import {FaUserGraduate, FaGraduationCap} from 'react-icons/fa';
import { useState } from 'react';
import './settings.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import Error from "../../components/error/Error";

const Setup = ({setCreatedAccount}) => {

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [collegeName, setCollegeName] = useState('');
    const [city, setCity] = useState('');
    const [major, setMajor] = useState('');
    const [error, setError] = useState("");

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleNextClick = async() => {

        if(step === 1) {
            console.log("step 1");
            setLoading(true);
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=pk.eyJ1IjoiYXNod2ludGFsd2Fsa2FyIiwiYSI6ImNrdWQ5MTNsdTAwdTgyb3BmZ2N1MGhjOGIifQ.qPKo5Apru46tSyGaY7UE3w`)
            .then(res => res.json())
            .then(data => {
                setLatitude(data.features[0].center[1])
                setLongitude(data.features[0].center[0])
                setStep(step + 1);
            })
            .catch(
                (err) => {
                    setError("Error finding city");
                    setLoading(false);
                }
            )
        } 
        else{
            setStep(step + 1);
        }


    }

    const hanldeCreateAccountClick = async() => {
        setLoading(true);
        const auth = getAuth();
        const db = getFirestore();

        const userDocRef = doc(db, 'users', auth.currentUser.uid);

        await setDoc(userDocRef, {
            college: collegeName,
            city: city,
            major: major,
            following: [],
            followers: [],
            name: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
            uid: auth.currentUser.uid,
            createdAt: new Date().toISOString()
        }).then(() => {
            setLoading(false);
            setCreatedAccount(true);
            localStorage.setItem('user', JSON.stringify(user.data()));
        })

        const locationDocRef = doc(db, 'locations', auth.currentUser.uid);

        await setDoc(locationDocRef, {
            lat: latitude,
            lng: longitude,   
            author: auth.currentUser.uid,
            photoUrl: auth.currentUser.photoURL,
            name: auth.currentUser.displayName,
            city: city,
            followers: JSON.parse(localStorage.getItem('user')).followers,
            
        }).then(() => {
            setError("");
            setLoading(false);
        })
        
    }
    return (
        <>
            <div className="setup-container">
                <div className="header">
                    <FaUserGraduate size = {35}/>
                    <h1>Let's Get You Set Up</h1>
                </div>
                <br />
                <br />
                <br />
                <br />
                <div className="setup-feilds">
                    {
                        step === 0 &&
                        <>
                            <div className="indivisual-feild">
                                <h3>Where are you going to college?</h3>
                                <input onChange = {(e) => {setCollegeName(e.target.value)}} required type="text" placeholder="Enter Your College Name"/>
                            </div>
                            <br />
                            <button onClick = {handleNextClick} className="blue-button">
                                Next
                            </button>
                        </>
                    }
                    {
                        step === 1 &&
                        <>
                            <div className="indivisual-feild">
                                <h3>What city will you be located in?</h3>
                                <input onChange = {(e) => {setCity(e.target.value)}}  required type="text" placeholder="Wisconsin"/>
                            </div>
                            <br />
                            {error && <Error message = {error}/>}
                            <br />
                            <button onClick = {handleNextClick} className="blue-button">
                                Next
                            </button>


                        </>
                    }
                    {
                        step === 2 &&
                        <>
                            <div className="indivisual-feild">
                                <h3>What is your major?</h3>
                                <input onChange = {(e) => {setMajor(e.target.value)}} required type="text" placeholder="Computer Science"/>
                            </div>
                            <br />
                            <button onClick = {handleNextClick} className="blue-button">
                                Next
                            </button>
                        </> 
                    }
                    {
                        step === 3 &&
                        <>
                            <h1>You are all set up! <FaGraduationCap /></h1>
                            <button onClick = {hanldeCreateAccountClick} className="blue-button">Get Started With Grad Map</button>
                        </>
                    }
                </div>

            </div>
        </>
      );
}
 
export default Setup;