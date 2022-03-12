import React, {useState, useEffect} from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const RecuperationArticle=()=>{
    const[data, setData]=useState([]);
    const[reponse, setReponse]=useState();

    useEffect(()=>{
        let searchParams = new URLSearchParams(window.location.search);
        let idProduit;
        for (let p of searchParams) {
            idProduit=searchParams.get("id");
        };
        axios.post('http://localhost:3001/extractionforumindividuelle', {
            id: idProduit
          })
          .then(function (response) {
            setData(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
    },[]);
    return(
        <div className="divVideo">
            {data.map((forum)=>{
                if(forum.type === "image"){
                  if(parseInt(forum.utilisateur) === parseInt(document.cookie.split(";")[0].split("=")[1]) || 
                  parseInt(document.cookie.split(";")[0].split("=")[1]) === 1){
                        return(
                            <div className="divVideo1">
                              <img alt="image contenu" className="video" width="300px" height="300px" src={"./videos/"+forum.contenu}/>
                            <p>{forum.nom}</p>
                            <p>{forum.date.split("T")[0]+" a "+forum.date.split("T")[1].split(".")[0]}</p>
                            <button
                            onClick={(e)=>{
                              let searchParams = new URLSearchParams(window.location.search);
                              let idProduit;
                              for (let p of searchParams) {
                                  idProduit=searchParams.get("id");
                              };
                                let liensupprime="../frontend/public/videos/"+forum.contenu;
                                let liensqlsupprime=forum.contenu;
                                axios.post("http://localhost:3001/suppressionvideo", {
                                  videosupprime:liensupprime,
                                  liensqlvideo:liensqlsupprime,
                                  id: idProduit
                                },{
                                    params:{
                                        utilisateur: document.cookie.split(";")[0].split("=")[1]
                                    },
                                    headers: {
                                        'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
                                      }
                                })
                                .then((result) => {
                                  setReponse(<p style={{color: "green"}}>Supprime</p>);
                                })
                               .catch((err) => {
                                setReponse(<p style={{color: "red"}}>Suppression echoue</p>);
                              });
                              axios.post("http://localhost:3001/suppressionvideocharge", {
                                  videosupprime:liensupprime,
                                  liensqlvideo:liensqlsupprime,
                                  id: idProduit
                                },{
                                    params:{
                                        utilisateur: document.cookie.split(";")[0].split("=")[1]
                                    },
                                    headers: {
                                        'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
                                      }
                                })
                                .then((result) => {
                                  setReponse(<p style={{color: "green"}}>Supprime</p>);
                                })
                               .catch((err) => {
                                setReponse(<p style={{color: "red"}}>Suppression echoue</p>);
                              });
                            }}
                            >Supprimer</button>
                            {reponse}
                        </div>
                        )
                    }else{
                        return(
                            <div className="divVideo1">
                              <img alt="image contenu" className="video" width="300px" height="300px" src={"./videos/"+forum.contenu}/>
                            <p>{forum.nom}</p>
                            <p>{forum.date.split("T")[0]+" a "+forum.date.split("T")[1].split(".")[0]}</p>
                        </div>
                        )
                    }
                }
                if(forum.type === "texte"){
                    if(parseInt(forum.utilisateur) === parseInt(document.cookie.split(";")[0].split("=")[1]) || 
                    parseInt(document.cookie.split(";")[0].split("=")[1]) === 1){
                        return(
                            <div>
                              <label for="texte">Texte</label>
                              <input id="texte" className="resultatTexte" type="text" defaultValue={forum.contenu}/>
                            <p>{forum.nom}</p>
                            <p>{forum.date.split("T")[0]+" a "+forum.date.split("T")[1].split(".")[0]}</p>
                            <button className="buttonModifier"
                              onClick={(e)=>{
                                let searchParams = new URLSearchParams(window.location.search);
                                let idProduit;
                                for (let p of searchParams) {
                                    idProduit=searchParams.get("id");
                                };
                                let modifietexte=document.querySelector(".resultatTexte").value;
                                axios.post("http://localhost:3001/modificationtexte", {
                                  textemodifie: modifietexte,
                                  utilisateur: document.cookie.split(";")[0].split("=")[1],
                                  id: idProduit
                                },{
                                  headers: {
                                    'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
                                  }
                                })
                                .then((result) => {
                                  setReponse(<p style={{color: "green"}}>Modifier</p>);
                                })
                               .catch((err) => {
                                setReponse(<p style={{color: "red"}}>Modification echoue</p>);
                              });
                              if(parseInt(document.cookie.split(";")[0].split("=")[1]) === 1){
                                axios.post("http://localhost:3001/modificationtextecharge", {
                                  textemodifie: modifietexte,
                                  id: idProduit
                                },{
                                  headers: {
                                    'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
                                  }
                                })
                                .then((result) => {
                                  setReponse(<p style={{color: "green"}}>Modifier</p>);
                                })
                               .catch((err) => {
                                setReponse(<p style={{color: "red"}}>Modification echoue</p>);
                              });
                              }
                            }}
                              >Modifier</button>
                              <button className="buttonSupprimer"
                              onClick={(e)=>{
                                let searchParams = new URLSearchParams(window.location.search);
                                let idProduit;
                                for (let p of searchParams) {
                                    idProduit=searchParams.get("id");
                                };
                                let supprimetexte=forum.contenu;
                                axios.post("http://localhost:3001/suppressiontexte", {
                                  textesupprime: supprimetexte,
                                  utilisateur: document.cookie.split(";")[0].split("=")[1],
                                  id: idProduit
                                },{
                                  headers: {
                                    'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
                                  }
                                })
                                .then((result) => {
                                  setReponse(<p style={{color: "green"}}>Supprime</p>);
                                })
                               .catch((err) => {
                                setReponse(<p style={{color: "red"}}>Suppression echoue</p>);
                              });
                              axios.post("http://localhost:3001/suppressiontextecharge", {
                                  textesupprime: supprimetexte,
                                  id: idProduit
                                },{
                                  headers: {
                                    'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
                                  }
                                })
                                .then((result) => {
                                  setReponse(<p style={{color: "green"}}>Supprime</p>);
                                })
                               .catch((err) => {
                                setReponse(<p style={{color: "red"}}>Suppression echoue</p>);
                              });
                            }}
                              >Supprimer</button>
                              {reponse}
                          </div>
                        )
                    }else{
                        return(
                            <div>
                              <p className="resultatTexte">{forum.contenu}</p>
                            <p>{forum.nom}</p>
                            <p>{forum.date.split("T")[0]+" a "+forum.date.split("T")[1].split(".")[0]}</p>
                          </div>
                        )
                    }
                }
            })}
        </div>
    );
};

const CreationCommentaire=()=>{
    const [reponse, setReponse]=useState();
    const [formulaire, setFormulaire]=useState(<div></div>);

    function autorisationCommentaire(){
        let searchParams = new URLSearchParams(window.location.search);
        let idProduit;
        for (let p of searchParams) {
            idProduit=searchParams.get("id");
        };
        axios.post('http://localhost:3001/extractionforumindividuelle', {
            id: idProduit
          })
          .then(function (response) {
              if(parseInt(response.data[0].utilisateur) !== parseInt(document.cookie.split(";")[0].split("=")[1])){
                setFormulaire(
                    <div className="texteLigne">
                        <p>Mettre en ligne son commentaire</p>
                        <form>
                          <label for="texte">Commentaire</label>
                            <textarea id="texte"></textarea>
                            <button 
                            onClick={event=>{
                                event.preventDefault();
                                let searchParams = new URLSearchParams(window.location.search);
                                let idProduit;
                                for (let p of searchParams) {
                                    idProduit=searchParams.get("id");
                                };
                                let valeurCommentaire=document.querySelector("textarea");
                                axios.post('http://localhost:3001/insertioncommentaire', {
                                    utilisateur: document.cookie.split(";")[0].split("=")[1],
                                    idproduit: idProduit,
                                    date: new Date(),
                                    commentaire: valeurCommentaire.value,
                                  },{
                                    headers: {
                                      'Authorization': "Bearer "+document.cookie.split(";")[1].split("=")[1]
                                    }
                                  })
                                  .then(function (response) {
                                    console.log(response);
                                    setReponse(<p style={{color:"green"}}>Envoye</p>);
                                    document.location.reload();
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
          })
          .catch(function (error) {
            console.log(error);
          });
    };

    useEffect(()=>{
        autorisationCommentaire();
       },[]);

    return formulaire;
};

const MapCommentaires=()=>{
    const[data, setData]=useState([]);
    const [donnees, setDonnees] = useState();
    useEffect(()=>{
        let searchParams = new URLSearchParams(window.location.search);
        let idProduit;
        for (let p of searchParams) {
            idProduit=searchParams.get("id");
        };
        axios.post('http://localhost:3001/extractioncommentaire', {
            id: idProduit
          })
          .then(function (response) {
            setData(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
    },[]);
    return(
        <div className="divVideo">
            {data.map((forum)=>{
                    return(
                        <div>
                        <p className="resultatTexte">{forum.commentaire}</p>
                        <p>{forum.nom}</p>
                        <p>{forum.date.split("T")[0]+" a "+forum.date.split("T")[1].split(".")[0]}</p>
                      </div>
                    )
            })}
        </div>
    );
};

const Article=()=>{
    return(
        <div>
            <Header/>
            <Navigation/>
            <RecuperationArticle/>
            <CreationCommentaire/>
            <MapCommentaires/>
            <Footer/>
        </div>
    );
};

export default Article;