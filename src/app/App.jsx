import { CreateUserPage } from "@/features/users"

export default function App(){
  return(
    <div className="min-h text-center grid grid-cols-1 gap-4 ">

      <h1 className="text-white text-4xl font-bold bg-fuchsia-800 p-6">
        Proyecto-formativo-jms
      </h1>

      <CreateUserPage/>

    </div>
  );

};