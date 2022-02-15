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

        data.append('image', fileData)

        axios("http://localhost:3001/insertionvideo", {
            method: "POST",
            data: data,
            body: {caca: "boudin"},
            headers: {
              'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
            },
            params:{
                utilisateur: document.cookie.split(";")[0].split("=")[1]
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
            <p className="pVideo">Mettre en ligne sa video</p>
            <form onSubmit={envoiFichier} className="formulaireVideo">
                <label className="labelVideo" for="video">Video</label>
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

const MapTexteVideos=()=>{
    const[data, setData]=useState([]);
    const [donnees, setDonnees] = useState();
    useEffect(()=>{
        axios.get('http://localhost:3001/extractionforum')
        .then((res)=>setData(res.data));
    },[]);
    return(
        <div className="divVideo">
            {data.map((forum)=>{
                if(forum.type === "image"){
                    return(
                        <div className="divVideo1">
                        <img className="video" width="300px" height="300px" src={"./videos/"+forum.contenu}/>
                        <button
                        onClick={(e)=>{
                            let liensupprime="../frontend/public/videos/"+forum.contenu;
                            let liensqlsupprime=forum.contenu;
                            axios.post("http://localhost:3001/suppressionvideo", {
                              videosupprime:liensupprime,
                              liensqlvideo:liensqlsupprime
                            },{
                                params:{
                                    utilisateur: document.cookie.split(";")[0].split("=")[1]
                                },
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
                          axios.post("http://localhost:3001/suppressionvideocharge", {
                              videosupprime:liensupprime,
                              liensqlvideo:liensqlsupprime
                            },{
                                params:{
                                    utilisateur: document.cookie.split(";")[0].split("=")[1]
                                },
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
                    )
                }
                if(forum.type === "texte"){
                    return(
                        <div>
                        <p className="resultatTexte">{forum.contenu}</p>
                          <button className="buttonSupprimer"
                          onClick={(e)=>{
                            let supprimetexte=forum.contenu;
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
                    )
                }
            })}
        </div>
    );
};

const Forum=()=>{
    return(
        <div>
            <Header/>
            <Navigation/>
            <FormulaireVideo/>
            <FormulaireTexte/>
            <MapTexteVideos/>
        </div>
    );
};
export default Forum;