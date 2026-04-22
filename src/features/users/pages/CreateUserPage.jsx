import LoginUserForm from "../../home/components/LoginUserForm";
import UserRegisterForm from "../components/UserRegisterForm";
import CreateReturnable1 from "../../returnable-material/components/CreateReturnable-1";
import CreateReturnable2 from "../../returnable-material/components/CreateReturnable-2";
import CreateReturnable3 from "../../returnable-material/components/CreateReturnable-3";
import CreateReturnable4 from "../../returnable-material/components/CreateReturnable-4";
import ConsumableMaterialEdit from "../../consumable-material/components/ConsumableMaterialEdit";
import EditReturnableMaterial from "../../returnable-material/components/EditReturnableMaterial";
import RegisterConsumableMaterial from "../../consumable-material/components/RegisterConsumableMaterial";
import LoanEdit from "../../loans/components/LoanEdit";


export default function CreateUserPage(){

    return(
        <div>
            <LoginUserForm/>
            <br />
            <UserRegisterForm/>
            <br />
            =================================================================================================================================
            <br />
            <CreateReturnable4/>
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
            =================================================================================================================================
            <br />
            <RegisterConsumableMaterial/>
            <br />
            =================================================================================================================================
            <br />
            <LoanEdit/>
            <br />
            <br></br>
            
        </div>
        
    )
}