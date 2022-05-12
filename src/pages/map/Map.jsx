import './map.css';
import Map, { Marker } from "react-map-gl";
import { useState, useEffect } from 'react';
import { getFirestore, where, getDocs, collection, query } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';
const GradMap = () => {

    const mapboxToken = "pk.eyJ1IjoiYXNod2ludGFsd2Fsa2FyIiwiYSI6ImNsMzExbGszczBiZ3Qza3FxNGcxcDI0NTgifQ.1o2V8Ar0TcYtyZBnLXxXoA"

    const [locations, setLocations] = useState([]);

    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchData = async () => {
            const q = query(collection(db, "locations"), where("followers", "array-contains", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            const tempArray = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                tempArray.push(doc.data());
            })
            setLocations(tempArray);

        }
        fetchData();
    },[])
        
    return (
        <>
            <div className="map-container">
                <Map
                    mapStyle='mapbox://styles/ashwintalwalkar/ckuea6z3l17fq18nv6aobff7n'
                    mapboxAccessToken={mapboxToken}
                    onViewportChange={(viewPort) => setViewPort(viewPort)}
                    initialViewState={{
                        width: '100vw',
                        height: '100vh',
                        latitude: 39.8283,
                        longitude: -98.5795,
                        zoom: 2.5
                      }}
                >   
                {
                        locations.map((location, index) => {
                            return (
                                <Marker
                                key={index}
                                latitude={location.lat}
                                longitude={location.lng}
                                anchor="bottom"
                                pitchAlignment = "viewport"
                                >   
                                    <Link to={`/profile/${location.author}`}>
                                        <img src={location.photoUrl} className = 'marker' alt="profile" />
                                    </Link>
                                </Marker>
                            )
                        }
                    )}
                </Map>
            </div>
        </>
    );
}
 
export default GradMap;