function SignUpOrIn(props) {
    const buttonStyle = "!bg-transparent hover:!bg-[#3fA2A5] text-[#3fA2A5] hover:text-white !font-semibold w-55 h-10 mb-4 !rounded-full border !border-[#3fA2A5] !hover:border-transparent";
    return (
    <>
    {props.switchMode === "Register"?
      <button className={buttonStyle} onClick={props.onClick}> Sign up </button>
      : 
      <>
      <button className={buttonStyle} onClick={props.onClick}>Sign in</button> 
      </>
    }
    </>
  );
}

export default SignUpOrIn;
