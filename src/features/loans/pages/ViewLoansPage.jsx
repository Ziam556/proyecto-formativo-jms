import ViewLoans from "../components/ViewLoans";

export default function ViewLoansPage() {

  const handleNext = (data) => {
    console.log(data);
  };

  const handleCancel = () => {
    console.log("Editar");
  };

  return (

    <div className="min-h-[calc(100vh-64px)] px-6 py-5">

      <ViewLoans
        onNext={handleNext}
        onCancel={handleCancel}
      />

    </div>

  );
}