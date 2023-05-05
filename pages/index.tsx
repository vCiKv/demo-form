import createClass from "@/lib/createClass";
import { Inter } from "next/font/google";
import { FormEvent, HTMLInputTypeAttribute, useState } from "react";
import supabase from "@/lib/supaClient";
import Link from "next/link";
import { addPeople } from "@/lib/people";
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
const TestForm = ({
  setIsSubmitted,
}: {
  setIsSubmitted: (val?: any) => void;
}) => {
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
  const [loading, setLoading] = useState(false);
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
    console.log("name:", name, ":", name.length);
    if (name.length > 30) {
      alert(errorMessages.createInvalidLength("name", 30, "long"));
      return null;
    }
    if (name.length < 5) {
      alert(errorMessages.createInvalidLength("name", 5, "short"));
      return null;
    }
    setLoading(true);
    addPeople(
      { name, amount },
      () => {
        alert("successful");
        setIsSubmitted(true);
      },
      () => alert("failed to submit")
    );
    setLoading(false);
  };

  return (
    <div className="card bg-slate-900 p-4 shadow-lg">
      {loading && <Loading />}
      <form className="form-control" onSubmit={submitForm}>
        <h2 className="text-2xl font-bold mb-12 mt-6 text-center">Test Form</h2>
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
        <button className="btn">submit</button>
      </form>
    </div>
  );
};
const Loading = () => {
  return (
    <div className="z-50 block fixed top-0 left-0 bg-slate-800 card w-full h-full">
      <div className="p-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <progress className="progress w-56"></progress>
        <br />
        <span className="font-black font-xl">loading...</span>
      </div>
    </div>
  );
};
export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const FormComplete = () => {
    return (
      <div className="card bg-slate-900 md:w-full min-w-2/5 text-center p-24 mx-10 block">
        <h2>Thank you for your Application</h2>
        <Link className="link my-12 block text-2xl" href={"/applications"}>
          View Applications
        </Link>
      </div>
    );
  };
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between pt-24 md:p-24 ${inter.className}`}
    >
      {/* <Loading/> */}
      {isSubmitted ? (
        <FormComplete />
      ) : (
        <TestForm setIsSubmitted={setIsSubmitted} />
      )}
    </main>
  );
}
