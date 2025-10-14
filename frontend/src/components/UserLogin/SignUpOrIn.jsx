function SignUpOrIn(props) {
    const buttonStyle = "!bg-transparent hover:!bg-[#3fA2A5] text-[#3fA2A5] hover:text-white !font-semibold w-55 h-10 mb-4 !rounded-full border !border-[#3fA2A5] !hover:border-transparent";
    return (
    <>
    {props.switchMode === "Register"?
      <button className={buttonStyle}> Sign up </button>
      : 
      <>
      <div className='text-black mb-4'>Forgot Password?
        <span className='text-[#3fA2A5]'> Click here!</span>
      </div> 
      <button className={buttonStyle}>Sign in</button> 
      </>
    }
    </>
  );
}

export default SignUpOrIn;
