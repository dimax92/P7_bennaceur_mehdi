import React, {useState, useEffect} from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import axios from "axios";

//Formulaire video
const FormulaireVideo=()=>{
    const [fileData, setFileData] = useState();
    const [reponse, setReponse] = useState();

    const donneesFichier = (e) => {
        setFileData(e.target.files[0]);
    };

    const derniere =()=>{
        axios.post("http://localhost:3001/dernier", {
        utilisateur: document.cookie.split(";")[0].split("=")[1],
        date: new Date(),
        })
       .then((result) => {
        console.log(result);
       })
       .catch((err) => {
        console.log(err.message);
       });
    }

    const envoiFichier = (e) => {
        e.preventDefault();

        const data = new FormData();

        data.append('image', fileData);

        axios("http://localhost:3001/insertionvideo", {
            method: "POST",
            data: data,
            body: {date: new Date()},
            headers: {
              'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
            },
            params:{
                utilisateur: document.cookie.split(";")[0].split("=")[1], 
                date: new Date()
            }
          })
        .then((result) => {
            derniere();
            console.log(result);
            setReponse(<p style={{color:"green"}}>Envoye</p>);
        })
        .catch((err) => {
            console.log(err.message);
            setReponse(<p style={{color:"red"}}>Echec de l'envoi</p>);
        });
    }
    return(
        <div className="videoLigne">
            <p className="pVideo">Mettre en ligne son image</p>
            <form onSubmit={envoiFichier} className="formulaireVideo">
                <label className="labelVideo" for="video">Image</label>
                <input id="video" classname="inputVideo" type="file" onChange={donneesFichier}/>
                <button className="buttonVideo">Mettre en ligne</button>
            </form>
            {reponse}
        </div>
    )
};

const FormulaireTexte=()=>{
    const [reponse, setReponse]=useState();
      return(
          <div className="texteLigne">
              <p>Mettre en ligne son texte</p>
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

const MiseEnLigne=()=>{
    return(
        <div>
            <Header/>
            <Navigation/>
            <FormulaireVideo/>
            <FormulaireTexte/>
        </div>
    );
};
export default MiseEnLigne;