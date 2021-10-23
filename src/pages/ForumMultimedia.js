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
}
const MapVideos=()=>{
    const[data, setData]=useState([]);
    useEffect(()=>{
        axios.get('http://localhost:3001/extractionvideo')
        .then((res)=>setData(res.data));
        console.log(data)
    },[]);
    return(
        <div className="divVideo">
            {data.map((forumvideo)=>(
                <div className="divVideo1">
                    <video className="video" width="300px" height="300px" controls src={"./videos/"+forumvideo.video}/>
                    <button
                    onClick={(e)=>{
                        let liensupprime="../public/videos/"+forumvideo.video;
                        let liensqlsupprime=forumvideo.video;
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
            ))}
        </div>
    );
}
const ForumMultimedia=()=>{
    return(
        <div>
            <Header/>
            <Navigation/>
            <FormulaireVideo/>
            <MapVideos/>
        </div>
    );
};
export default ForumMultimedia;