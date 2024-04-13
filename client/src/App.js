
import './App.css';
import Axios from "axios"
import {useState,useEffect} from "react"

export default function App() {
  const [users,setUsres]=useState([])
  const [name,setName]=useState("")
  const [age,setAge]=useState("")
  const [email,setEmail]=useState("")



  useEffect(()=>{

    Axios.get("http://localhost:5000/users")
    .then(res=>{setUsres(res.data)})
  },[users])



  const createUser=()=>{
    Axios.post("http://localhost:5000/createUser",{
      name:name,
      age:age,
      email:email
    })
    .then(res=>{
      console.log(res.data)
    })
  }

  // const users =[{"_id":"661710d20635a316e9db86c2","name":"anas","age":21,"email":"anasmobeidat@gmail.com"},
  //               {"_id":"6617116b0635a316e9db86c3","name":"rama","age":20,"email":"ramaAlhourani@gmail.com"}
  //             ]

  return (
    <>
    

    {users.map(user=>{
      return(
        <div className="card">
        <ul>
          <li>name:{user.name}</li>
          <li>Age:{user.age}</li>
          <li>email:{user.email}</li>
        </ul>
       </div>
      )
    })}


    <div>
      <input type="text" placeholder="Name"  onChange={e=>setName(e.target.value)}/>
      <input type="number" placeholder="Age" onChange={e=>setAge(e.target.value)} />
      <input type="text" placeholder="Email"  onChange={e=>setEmail(e.target.value)}/>
      <button onClick={createUser}>Create user</button>
    </div>
    </>
      
  );
}


