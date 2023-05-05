import { getPeople } from "@/lib/people"
import Link from "next/link"
import { useEffect, useState } from "react"
const Application = ()=>{
  type PersonType = {id:any, name:string,amount:number}
  const [people,setPeople] = useState<PersonType[] | null>(null)
  
  useEffect (()=>{
    const getAllPeople =async () => {
      const allPeople =  await getPeople()
      setPeople(allPeople)
    }
    getAllPeople()
  },[])
  const DisplayPeople = ({people}:{people:PersonType[]})=>{
    return (  
      <div className="overflow-x-auto p-10">
        <h2 className="text-2xl font-bold mb-12 mt-6 text-center">Form Applications</h2>
        <table className="table w-full border border-slate-800 rounded-xl shadow-2xl">
          <thead>
            <tr>
              <th>name</th>
              <th>amount</th>
            </tr>
          </thead>
          <tbody>
            {people.map(person=><tr key={person.id} className="hover:active"><th>{person.name}</th><th>{person.amount.toLocaleString("US-en")}</th></tr>)}
          </tbody>
        </table>
        <Link className="link my-12 mx-auto block text-2xl text-center" href="/">Go Home</Link>
      </div>
    )
  }
  const LoadPeople = ()=>{
    return (
      <div className="p-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <progress className="progress w-56"></progress><br/>
        <span>loading...</span>
      </div>
    )
  }
  return(
   <>{ (people !== null) ? <DisplayPeople people={people}/> : <LoadPeople/>}</>
  )

}
export default Application