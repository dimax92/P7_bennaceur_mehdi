import React, {useState, useEffect} from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import axios from "axios";
//Formulaire texte
const FormulaireTexte=()=>{
  const [reponse, setReponse]=useState();
    return(
        <div className="texteLigne">
            <p>Mettre en ligne sa video</p>
            <form>
                <textarea></textarea>
                <button 
                onClick={event=>{
                    event.preventDefault();
                    let valeurTexte=document.querySelector("textarea");
                    axios.post('http://localhost:3001/insertiontexte', {
                        utilisateur: document.cookie.split(";")[0].split("=")[1],
                        date: new Date(),
                        texte: valeurTexte.value,
                      },{
                        headers: {
                          'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
                        }
                      })
                      .then(function (response) {
                        console.log(response);
                        setReponse(<p style={{color:"green"}}>Envoye</p>);
                      })
                      .catch(function (error) {
                        console.log(error);
                        setReponse(<p style={{color:"red"}}>Echec de l'envoi</p>);
                      })
                     }}
                >Mettre en ligne</button>
            </form>
            {reponse}
        </div>
    )
}
const ForumTexte=()=>{
    const[data, setData]=useState([]);
    useEffect(()=>{
        axios.get('http://localhost:3001/extractiontexte')
        .then((res)=>setData(res.data));
        console.log(data)
    },[]);
    return(
        <div className="divForumTexte">
            <Header/>
            <Navigation/>
            <FormulaireTexte/>
            <div>
            {data.map((forumtexte)=>(
                    <div>
                      <p className="resultatTexte">{forumtexte.texte}</p>
                        <button className="buttonSupprimer"
                        onClick={(e)=>{
                          let supprimetexte=forumtexte.texte;
                          axios.post("http://localhost:3001/suppressiontexte", {
                            textesupprime: supprimetexte,
                            utilisateur: document.cookie.split(";")[0].split("=")[1]
                          },{
                            headers: {
                              'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
                            }
                          })
                          .then((result) => {
                           console.log(result);
                          })
                         .catch((err) => {
                          console.log(err.message);
                        });
                        axios.post("http://localhost:3001/suppressiontextecharge", {
                            textesupprime: supprimetexte,
                          },{
                            headers: {
                              'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
                            }
                          })
                          .then((result) => {
                           console.log(result);
                          })
                         .catch((err) => {
                          console.log(err.message);
                        });
                      }}
                        >Supprimer</button>
                    </div>
            ))}
            </div>
        </div>
    );
};
export default ForumTexte;