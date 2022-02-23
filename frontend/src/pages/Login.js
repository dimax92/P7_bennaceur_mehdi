import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import axios from "axios";
const Login=()=>{
  const[data, setData]=useState([]);
  const[reponse, setReponse]=useState();
    useEffect(()=>{
        axios.get('http://localhost:3001/participation')
        .then((res)=>setData(res.data));
    },[]);

    return(
        <div className="structure inscription">
            <Header/>
            <Navigation/>
            <form className="formulaireInscription">
                <input className="email" type="email" required="required" placeholder="email"></input>
                <input className="motdepasse" type="password" required="required" placeholder="mot de passe"></input>
                <button 
                onClick={event=>{
                    event.preventDefault();
                    let valeurEmail=document.querySelector(".email");
                    let valeurMotdepasse=document.querySelector(".motdepasse");
                    axios.post('http://localhost:3001/profil', {
                        email: valeurEmail.value,
                        motdepasse: valeurMotdepasse.value,
                        date: new Date()
                      })
                      .then(function (response) {
                        console.log(response.status);
                        setReponse(<p style={{color: "green"}}>authentifiee avec succes</p>);
                        document.cookie="userId="+response.data.userId;
                        document.cookie="token="+response.data.token;
                        document.location.reload();
                      })
                      .catch(function (error) {
                        console.log(error);
                        setReponse(<p style={{color: "red"}}>authentification echoue</p>);
                      });
                     }
                     }>Se connecter</button>
            </form>
            {reponse}
            <div>
            {data.map((participation)=>(
              <div>
                <p>{"derniere participation de "+participation.nom+" le "+participation.derniereparticipation.split("T")[0]+" a "+participation.derniereparticipation.split("T")[1].split(".")[0]}</p>
              </div>
            ))}
            </div>
        </div>
    );
};
export default Login;