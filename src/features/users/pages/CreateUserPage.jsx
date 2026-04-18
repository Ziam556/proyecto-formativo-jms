import UserRegisterForm from "../components/UserRegisterForm";
import CreateReturnable1 from "../../returnable-material/components/CreateReturnable-1";
import CreateReturnable2 from "../../returnable-material/components/CreateReturnable-2";
import CreateReturnable3 from "../../returnable-material/components/CreateReturnable-3";
import ConsumableMaterialEdit from "../../consumable-material/components/ConsumableMaterialEdit";
import EditReturnableMaterial from "../../returnable-material/components/EditReturnableMaterial";


export default function CreateUserPage(){

    return(
        <div>
            <UserRegisterForm/>
            <br />
            =================================================================================================================================
            <br />
            <CreateReturnable1/>
            <br />
            =================================================================================================================================
            <br />
            <CreateReturnable2/>
            <br />
            =================================================================================================================================
            <br />
            <CreateReturnable3/>
            <br />
            =================================================================================================================================
            <br />
            <ConsumableMaterialEdit/>
            <br />
            =================================================================================================================================
            <br />
            <EditReturnableMaterial/>
            <br />
            <br></br>
            
        </div>
        
    )
}