import createClass from "@/lib/createClass";
import { Inter } from "next/font/google";
import { FormEvent, HTMLInputTypeAttribute, useState } from "react";
import supabase from "@/lib/supaClient";
const inter = Inter({ subsets: ["latin"] });

type InputProps = {
  type: HTMLInputTypeAttribute;
  onChange: (val: string | number, key: string) => void;
  name: string;
  value: string | number;
  label?: string;
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
};
const Input = (props: InputProps) => {
  const { type, onChange, value, name, label, size } = props;
  return (
    <div className={createClass(size ? `md:w-${size}/12` : "", "w-full mb-8")}>
      <div className="flex gap-y-2 flex-wrap">
        <label className="w-full font-semibold capitalize">{label}</label>
        <input
          type={type}
          onChange={(e) => onChange(e.target.value, name)}
          value={value}
          name={name}
          className="input input-bordered w-full rounded-md p-3"
        />
      </div>
    </div>
  );
};
const useInput = <T extends { name: string }>(
  arr: T[]
): [
  { [K in T["name"]]: string },
  (val: string | number, key: string) => void
] => {
  const convertToEmptyState = (): { [K in T["name"]]: string } => {
    const newArr: any = {};
    arr.forEach((item) => {
      newArr[item.name] = "";
    });
    return newArr;
  };
  const [formData, setFormData] = useState(convertToEmptyState());
  const changeFormData = (val: string | number, key: string) => {
    setFormData((p) => ({ ...p, [key]: val }));
  };
  return [formData, changeFormData];
};
export default function Home() {
  const formInput: Omit<InputProps, "value" | "onChange">[] = [
    {
      name: "name",
      type: "text",
      label: "full name",
    },
    {
      name: "amount",
      type: "number",
      label: "request amount",
    },
  ];
  // const convertToEmptyState = (arr: { name: string; [key: string]: any }[]) => {
  //   let newArr: { [key: string]: string } = {};
  //   arr.forEach((item) => {
  //     newArr[item.name] = "";
  //   });
  //   return newArr;
  // };
  // console.log("state is", convertToEmptyState(formInput));
  // const [formData, setFormData] = useState(convertToEmptyState(formInput));
  // const changeFormData = (val: string | number, key: string) => {
  //   setFormData((p) => ({ ...p, [key]: val }));
  // };
  const errorMessages = {
    createNoInput: (field: string) => "please fill missing field: " + field,
    createInvalidInput: (field: string) => "invalid input in field: " + field,
    createInvalidLength: (
      field: string,
      limit: number,
      type: "short" | "long"
    ) =>
      `invalid length in field:${field} it must be ${
        type === "short" ? "more than" : "less than"
      } ${limit} characters`,
  };
  const [formData, changeFormData] = useInput(formInput);
  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    for (const input in formData) {
      if (formData[input] === "") {
        alert(errorMessages.createNoInput(input));
        return null;
      }
    }
    const amount = Number(formData.amount);
    const name = formData.name;
    if (isNaN(amount) || amount <= 0) {
      alert(errorMessages.createInvalidInput("amount"));
      return null;
    }
    if (name.length > 30) {
      alert(errorMessages.createInvalidLength("name", 30, "long"));
      return null;
    }
    if (name.length > 5) {
      alert(errorMessages.createInvalidLength("name", 5, "short"));
      return null;
    }
    addPeople({name,amount},()=>alert("successful"),()=>alert("failed to submit"))
    alert(1);
  };
  const addPeople = async (
    sentData: {},
    onSuccess: ([...args]?: any) => void,
    onError: ([...args]?: any) => void
  ) => {
    const { data, error } = await supabase.from("people").insert([sentData]);
    if (data) {
      onSuccess();
      return;
    }
    if(error){
      console.log(error)
    }
    onError();
    return;
  };
  const getPeople = async () => {
    let { data: people, error } = await supabase
      .from("people")
      .select("amount,name");
    console.log('data:',people);
    console.error('error',error)
  }
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="card bg-slate-900 p-4 shadow-lg">
        <form className="form-control" onSubmit={submitForm}>
          {formInput.map((input) => (
            <Input
              key={input.name}
              name={input.name}
              label={input.label}
              value={formData[input.name]}
              onChange={changeFormData}
              type={input.type}
            />
          ))}
          <button className="btn" onClick={() => getPeople()}>
            submit
          </button>
        </form>
      </div>
    </main>
  );
}
