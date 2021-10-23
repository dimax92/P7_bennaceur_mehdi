import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import ForumMultimedia from "./pages/ForumMultimedia";
import ForumTexte from "./pages/ForumTexte";
import Inscription from "./pages/Inscription";
import Profil from "./pages/Profil";
import ChargeDeCommunication from "./pages/ChargeDeCommunication"
import PageNonTrouve from "./pages/PageNonTrouve";
const App=()=>{
    return(
        <BrowserRouter>
           <Switch>
             <Route path="/" exact component={Accueil}/>
             <Route path="/ForumMultimedia" exact component={ForumMultimedia}/>
             <Route path="/ForumTexte" exact component={ForumTexte}/>
             <Route path="/Inscription" exact component={Inscription}/>
             <Route path="/Profil" exact component={Profil}/>
             <Route path="/ChargeDeCommunication" exact component={ChargeDeCommunication}/>
             <Route component={PageNonTrouve}/>
           </Switch>
        </BrowserRouter>
    );
};
export default App;
