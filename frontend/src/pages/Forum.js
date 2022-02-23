import React, {useState, useEffect} from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import axios from "axios";

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
                          <a href={"Article?id="+forum.id}>
                          <img className="video" width="300px" height="300px" src={"./videos/"+forum.contenu}/>
                          </a>
                        <p>{forum.nom}</p>
                        <p>{forum.date.split("T")[0]+" a "+forum.date.split("T")[1].split(".")[0]}</p>
                    </div>
                    )
                }
                if(forum.type === "texte"){
                    return(
                        <div>
                        <a className="lienTexte" href={"Article?id="+forum.id}>
                          <p className="resultatTexte">{forum.contenu}</p>
                        </a>
                        <p>{forum.nom}</p>
                        <p>{forum.date.split("T")[0]+" a "+forum.date.split("T")[1].split(".")[0]}</p>
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
            <MapTexteVideos/>
        </div>
    );
};
export default Forum;