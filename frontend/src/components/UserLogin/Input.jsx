function Input(props) {
  return (
    <>
    <div className="flex flex-row mt-4 mb-4 p-2 bg-gray-200">
      <img src={props.name} alt={props.alternative} />
      <input className="ml-2 placeholder-gray-500 text-black" type={props.type} placeholder={props.placeholder} id={props.id} />
    </div>
    </>
  );
}

export default Input;
