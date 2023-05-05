import supabase from "./supaClient";

export const getPeople = async () => {
  let { data: people, error } = await supabase
    .from("people")
    .select("amount,name,id");
  if(people){
    return people
  }
  if(error){
    console.error(error)
  }
  return null
}
export const addPeople = async (
  sentData: {},
  onSuccess: ([...args]?: any) => void,
  onError: ([...args]?: any) => void
) => {
  const { error } = await supabase.from("people").insert([sentData]);
  if(error){
    console.log(error)
    onError();
    return;
  }
  onSuccess();
  return;

};