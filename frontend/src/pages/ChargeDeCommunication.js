import React, {useState, useEffect} from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const ChargeDeCommunication=()=>{
    const[reponse, setReponse]=useState();
    return(
        <div>
            <Header/>
            <Navigation/>
            <form className="formCharge">
              <label>Mot de passe</label>
               <input id="motdepasse" className="inputCharge" type="password"></input>
               <button
               onClick={event=>{
                event.preventDefault();
                let valeurMotdepasse=document.querySelector(".inputCharge");
                axios.post('http://localhost:3001/logincharge', {
                    userId: 1,
                    motdepasse: valeurMotdepasse.value,
                  })
                  .then(function (response) {
                    console.log(response.status);
                    setReponse(<p style={{color: "green"}}>authentifiee avec succes</p>);
                    document.cookie="userId="+response.data.userId;
                    document.cookie="token="+response.data.token;
                    document.location.reload();
                    console.log("le super token: "+document.cookie.split(";")[1].split("=")[1]);
                  })
                  .catch(function (error) {
                    console.log(error);
                    setReponse(<p style={{color: "red"}}>authentification echoue</p>);
                  })
                 }}
               >Se connecter</button>
            </form>
            {reponse}
            <Footer/>
        </div>
    )
};

export default ChargeDeCommunication;