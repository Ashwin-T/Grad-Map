import {Routes, Route} from 'react-router-dom';
import React, {Suspense} from 'react';

import Feed from './feed/Feed';
// import Setup from './settings/Setup';
// import Add from './add/Add';
// import Search from './search/Search';
// import Profile from './profile/Profile';
// import User from './user/User';
import { useState, useEffect } from 'react';
import {getFirestore, getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import Navbar from '../components/navbar/Navbar';
import Loading from '../components/loading/Loading';
// import TopBar from '../components/navbar/topbar/Topbar';
const AppRoutes = () => {

    const [createdAccount, setCreatedAccount] = useState(false);
    const [loading, setLoading] = useState(true);
    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {

        const checkIfCreatedAccount = async () => {
            setLoading(true);
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            const user = await getDoc(userDocRef);

            if(user.exists()){
                setCreatedAccount(true);
                localStorage.setItem('user', JSON.stringify(user.data()));
            }

            setLoading(false);
        }

        checkIfCreatedAccount();
            // auth.signOut();

    } , [createdAccount, db]);

    const Setup = React.lazy(()=>import('./settings/Setup'));
    const Add = React.lazy(()=>import('./add/Add'));
    const Search = React.lazy(()=>import('./search/Search'));
    const Profile = React.lazy(()=>import('./profile/Profile'));
    const User = React.lazy(()=>import('./user/User'));
    const Info = React.lazy(()=>import('./info/Info'));
    const Settings = React.lazy(()=>import('./settings/Settings'));
    const GradMap = React.lazy(()=>import('./map/Map'));
    const Notifications = React.lazy(()=>import('./notifications/Notifications'));

    return (  
        <>
           <Suspense fallback = {<Loading />}>
            <Routes>
                    <Route exact path="/" element={

                        <>
                            {
                                !createdAccount ? loading ? <Loading /> : <Setup setCreatedAccount={setCreatedAccount} /> : <Feed />
                            }
                        </>
                    }/>
                    <Route exact path="/map" element = {<GradMap />} />
                    <Route exact path="/search" element={<Search />} />
                    <Route exact path="/add" >
                        <Route exact path="/add/:id" element={<Add />} />
                    </Route>
                    <Route exact path="/notifications" element={<Notifications />} />
                    <Route exact path="/user" element={<User />} />  
                    <Route exact path="/settings" element={<Settings />} />
                    <Route exact path="/info" element={<Info />} />
                    <Route exact path="/profile">
                        <Route exact path="/profile/:uid" element={<Profile />} />
                    </Route>
                </Routes>
                {createdAccount && <Navbar />}
           </Suspense>
        </>
    );
}
 
export default AppRoutes;