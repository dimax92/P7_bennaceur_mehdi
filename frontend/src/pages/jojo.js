function mettreEnLigneCommentaire(){
    return <button 
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
}