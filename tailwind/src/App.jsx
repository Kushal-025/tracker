import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Cards from './component/cards'

function App() {
 
 let age = 22;
 let myArr=[1,2,3,4,5];


 let myObj={
  name: "sumi",
  designation:"nurse"
 }

  return (
    <>
      <Cards userName="kushal" companyName= "Tech crop" age= {age} myArr={myArr} myObj={myObj}/>
      <Cards age={age} />
      <Cards userName= "Sumi"/>
    </>
  )
}

export default App
