import React, {useState} from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import axios from "axios";
const Inscription=()=>{
    const [reponse, setReponse]=useState();
    return(
        <div className="structure inscription">
            <Header/>
            <Navigation/>
            <form className="formulaireInscription">
                <input className="nom" type="text" required="required" placeholder="nom"></input>
                <input className="email" type="email" required="required" placeholder="email"></input>
                <input className="motdepasse" type="password" required="required" placeholder="mot de passe"></input>
                <button 
                onClick={event=>{
                    event.preventDefault();
                    let valeurNom=document.querySelector(".nom");
                    let valeurEmail=document.querySelector(".email");
                    let valeurMotdepasse=document.querySelector(".motdepasse");
                    axios.post('http://localhost:3001/signup', {
                        nom: valeurNom.value,
                        email: valeurEmail.value,
                        motdepasse: valeurMotdepasse.value,
                        date: new Date()
                      })
                      .then(function (response) {
                        console.log(response);
                        setReponse(<p style={{color:"green"}}>Inscription reussi</p>);
                      })
                      .catch(function (error) {
                        console.log(error);
                        setReponse(<p style={{color:"red"}}>Inscription echoue</p>)
                      })
                     }}>S'inscrire</button>
            </form>
            {reponse}
        </div>
    );
};
export default Inscription;