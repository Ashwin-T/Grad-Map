import {useState} from 'react';
import './search.css'
import { collection, query, where, getFirestore, getDocs } from "firebase/firestore";
import { Link } from 'react-router-dom';
const Search = () => {

    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const db = getFirestore();

    const handleSearch = async() => {
        if(search != ""){
            const userRef = collection(db, "users");
            const q = query(userRef, where("name", "==", search));

            const querySnapshot = await getDocs(q);
            const tempArr = [];
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
                tempArr.push(doc);
            });

            setResults(tempArr);
            setSearched(true);

        }
        
    }

    const handleChange = (e) => {
        setSearch(e.target.value);
        setSearched(false);
    }

    return (  
        <>
        
            <div className="search-container">
                <br />
                <div className="search-field">
                    <input value = {search} onChange = {(e) =>handleChange(e)}type="text" placeholder="Try entering their full name..." />
                    <button onClick = {handleSearch} className="blue-button">
                        Search
                    </button>
                </div>
                <br />
                <br />
                {
                    searched &&
                    <>
                        {
                            results.length > 0 ? 
                            <>
                                {
                                    results.map((user) => {
                                        return (
                                            <Link to = {"/profile/" + user.data().uid} key = {user.id} className="search-result">
                                                <img src={user.data().photoURL} alt="user-profile" />
                                                <h3>{user.data().name}</h3>
                                            </Link>
                                        )
                                    })
                                }
                            </>
                            :
                            <center><p>No results for "{search}"</p></center>
                        }
                    </>
                }
            </div>
        </>
    );
}
 
export default Search;