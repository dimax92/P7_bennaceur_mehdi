import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import Inscription from "./pages/Inscription";
import ChargeDeCommunication from "./pages/ChargeDeCommunication"
import PageNonTrouve from "./pages/PageNonTrouve";
import Profil from "./pages/Profil";
import Forum from "./pages/Forum";
const App=()=>{
    return(
        <BrowserRouter>
           <Switch>
             <Route path="/" exact component={Login}/>
             <Route path="/Profil" exact component={Profil}/>
             <Route path="/Forum" exact component={Forum}/>
             <Route path="/Inscription" exact component={Inscription}/>
             <Route path="/ChargeDeCommunication" exact component={ChargeDeCommunication}/>
             <Route component={PageNonTrouve}/>
           </Switch>
        </BrowserRouter>
    );
};
export default App;
