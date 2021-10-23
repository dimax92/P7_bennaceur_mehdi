import React from "react";
import { NavLink } from "react-router-dom";
const Navigation=()=>{
    return(
        <div>
            <NavLink className="navigation" activeClassName="nav-active" exact to="/">
                Accueil
            </NavLink>
            <NavLink className="navigation" activeClassName="nav-active" exact to="/ForumMultimedia">
                Forum multimedia
            </NavLink>
            <NavLink className="navigation" activeClassName="nav-active" exact to="/ForumTexte">
                Forum texte
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
    );
};
export default Navigation;