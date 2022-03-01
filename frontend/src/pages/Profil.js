import React, {useState} from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
const Profil=()=>{
    const [reponse, setReponse]=useState();

    function modifierProfil(lien, donnees){
        axios.post(lien, {
            donnees: donnees,
            date: new Date(),
            utilisateur: document.cookie.split(";")[0].split("=")[1]
          }, {
            headers: {
              'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
            }
          })
          .then(function (response) {
            console.log(response);
            setReponse(<p style={{color:"green"}}>Modification reussi</p>);
          })
          .catch(function (error) {
            console.log(error);
            setReponse(<p style={{color:"red"}}>Echec modification</p>)
          }) 
    }

    return(
        <div className="structure inscription">
            <Header/>
            <Navigation/>
            <form className="formulaireInscription">
              <label for="nom">Nom</label>
                <input id="nom" className="nom" type="text" required="required" placeholder="nom"></input>
                <button
                onClick={event=>{
                    event.preventDefault();
                    let valeurNom=document.querySelector(".nom");
                    modifierProfil('http://localhost:3001/modifienom', valeurNom.value);
                }}>Modifier Nom</button>
                <label for="email">Email</label>
                <input id="email" className="email" type="email" required="required" placeholder="email"></input>
                <button               
                onClick={event=>{
                    event.preventDefault();
                    let valeurEmail=document.querySelector(".email");
                    modifierProfil('http://localhost:3001/modifieemail', valeurEmail.value);
                }}>Modifier Email</button>
                <label for="motdepasse">Mot de passe</label>
                <input id="motdepasse" className="motdepasse" type="password" required="required" placeholder="mot de passe"></input>
                <button                
                onClick={event=>{
                    event.preventDefault();
                    let valeurMotdepasse=document.querySelector(".motdepasse");
                    modifierProfil('http://localhost:3001/modifiemotdepasse', valeurMotdepasse.value);
                }}>Modifier Mot de passe</button>
            </form>
            {reponse}
            <button className="supprimer" 
            onClick={event=>{
              event.preventDefault();
              axios.post('http://localhost:3001/supprimercompte', {
                  utilisateur: document.cookie.split(";")[0].split("=")[1],
                },{
                  headers: {
                    'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
                  }
                })
                .then(function (response) {
                  console.log(response);
                  setReponse(<p style={{color: "green"}}>supprime avec succes</p>);
                })
                .catch(function (error) {
                  console.log(error);
                  setReponse(<p style={{color: "red"}}>suppression echoue</p>);
                });
               }}
            >Supprimer le compte</button>
            <Footer/>
        </div>
    );
};
export default Profil;