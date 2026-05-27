import ViewMaterialConsumable from "../components/ViewMaterialConsumable";

export default function ViewMaterialConsumablePage() {

  const handleNext = (data) => {
    console.log(data);
  };

  const handleCancel = () => {
    console.log("Editar");
  };

  return (

    <div className="min-h-[calc(100vh-64px)] px-6 py-5">

      <ViewMaterialConsumable
        onNext={handleNext}
        onCancel={handleCancel}
      />

    </div>

  );
}