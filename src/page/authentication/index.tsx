import { routeUrl } from "constant";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "utility/helper";
import { useFetch } from "utility/hooks/apiHooks/useFetch";
import { InputForm } from "components"
import * as yup from "yup";
import handleValidate from "utility/hooks/setupHooks/validationHook";
import _ from "lodash"

const Login = () => {
  const navigate = useNavigate();
  const { loginProccess, isAuthLoading } = useFetch();
  const [error, setError] = useState("");
  const [formToState, setFormToState] = useState([
    {
      title: "Name",
      placeholder: "e.g alexa andreas",
      type: "text",
      value: "",
      name: "name",
      options: [],
      rules: yup.string().required("Name is required!"),
      error: ""
    }, 
    {
      title: "Email",
      placeholder: "e.g test@123.com",
      type: "text",
      value: "",
      name: "email",
      options: [],
      rules: yup.string().email().required("Email is required!"),
      error: ""
    }, 
  ])

  const handleChangeField = (event) => {
    const cloneForms =_.cloneDeep(formToState)
    const eventName = event.target.name
    const eventValue = event.target.value
    let filteredForm = _.filter(cloneForms, (data) => data.name === eventName)[0]
    filteredForm.value = eventValue
      
    setFormToState(cloneForms)
  }

  const handleOnChange = (event) => {
    const targetType = event.target.type
    switch (targetType) {
      case "text":
      case "email":
        handleChangeField(event)
        break;
      default:
        break;
    }
  }

  const handleSubmit = () => {
    let cloneForms = _.cloneDeep(formToState)
    const handleResetError = () => {
      cloneForms = cloneForms.map(result => ({...result, error: ""}))
    }

    handleValidate(formToState)
    .then((result) => {
      if(result.status === 200) {
        handleResetError()
        setFormToState(cloneForms)
        loginProccess({name: cloneForms[0].value, email:cloneForms[1].value}, (response) => {
          if (response?.status === 200) {
            setCookie('auth', "signed", 3)
            navigate(routeUrl.dogList); 
          } else {
            setError("Login failed. Please check your credentials.");
          }
        })
      } else {
        const errorsObj = result.data
        handleResetError()
        Object.keys(errorsObj).forEach(error => {
          const filteredForm = _.filter(cloneForms, (data) => data.name === error)[0]
          filteredForm.error = errorsObj[error]

          setFormToState(cloneForms)
        })
      }
    })
  }

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">🐶 Login to Fetch Dogs</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <InputForm 
          formData={formToState}
          onChange={handleOnChange}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center mt-4"
          disabled={isAuthLoading}
        >
          {isAuthLoading ? (
            <span className="animate-spin border-t-4 border-white border-solid h-5 w-5 rounded-full mr-2"></span>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;
