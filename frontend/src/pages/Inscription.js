import React, {useState} from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
const Inscription=()=>{
    const [reponse, setReponse]=useState();
    return(
        <div className="structure inscription">
            <Header/>
            <Navigation/>
            <form className="formulaireInscription">
              <label for="nom">Nom</label>
                <input id="nom" className="nom" type="text" required="required" placeholder="nom"></input>
                <label for="email">Email</label>
                <input id="email" className="email" type="email" required="required" placeholder="email"></input>
                <label for="motdepasse">Mot de passe</label>
                <input id="motdepasse" className="motdepasse" type="password" required="required" placeholder="mot de passe"></input>
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
            <Footer/>
        </div>
    );
};
export default Inscription;