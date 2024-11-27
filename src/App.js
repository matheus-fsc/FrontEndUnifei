import React, { useEffect, useState } from 'react'

export default function App() {

  const[contador,setCont] =useState(0);
  const [dados, setDados] = useState([]);
  //const url = 'http://localhost:9082/usuarios'
  // const url = "https://backend-aulaweb.vercel.app/usuarios"

  useEffect( () => {
    fetch(url)
      .then( respFetch => respFetch.json() )
      .then( respJson => setDados(respJson))
      .catch( respError => {
        console.log("Error" , respError)
      } )
  }, [] ); 

  useEffect( () => {
    console.log("test")
  } , [contador]);

  return (
    <div>
      <p>Paragrafo qualquer</p>
      <p>Contador {contador} </p>
      <button onClick={ () => setCont(contador + 1)}>botão</button>

      {dados.map((item) => {
        return(
          <p key={item.id}>{item.nome}</p>
        )
      })}

      
    </div>
  )
}
