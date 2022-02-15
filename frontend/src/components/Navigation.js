import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
const Navigation=()=>{
    const[reponse, setReponse]=useState([]);
    const[cook, setCook]=useState([])
    const[navigation, setNavigation]= useState(
        <div className="nav">
            <NavLink className="navigation" activeClassName="nav-active" exact to="/">
                Login
            </NavLink>
            <NavLink className="navigation" activeClassName="nav-active" exact to="/Inscription">
                Inscription
            </NavLink>
            <NavLink className="navigation" activeClassName="nav-active" exact to="/ChargeDeCommunication">
                Charge de communication
            </NavLink>
        </div>
    );

    function testConnexion(lien){
        if(document.cookie.split(";")[1] !== undefined){
            axios.get(lien,
            {
                headers: {
                  'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
                }
              })
              .then((response) => setNavigation(
            <div className="nav">
                <NavLink className="navigation" activeClassName="nav-active" exact to="/">
                    Login
                </NavLink>
                <NavLink className="navigation" activeClassName="nav-active" exact to="/Forum">
                    Forum
                </NavLink>
                <NavLink className="navigation" activeClassName="nav-active" exact to="/Inscription">
                    Inscription
                </NavLink>
                <NavLink className="navigation" activeClassName="nav-active" exact to="/Profil">
                    Profil
                </NavLink>
                <NavLink className="navigation" activeClassName="nav-active" exact to="/ChargeDeCommunication">
                    Charge de communication
                </NavLink>
            </div>
              ))
             .catch((err) => setReponse("Non"));
        }
    }

    useEffect(()=>{
        testConnexion("http://localhost:3001/authentification");
        testConnexion("http://localhost:3001/authentificationcharge");
       },[]);
    
    console.log(reponse);
    return navigation;
};
export default Navigation;