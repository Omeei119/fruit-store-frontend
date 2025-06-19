import axios from "axios";
import { useState } from "react";

function SignupPage(props) {
  let [signupStatus, setSignupStatus] = useState("no");

  function handleSignupFormSubmit(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let user = {};
    for (let data of formData) {
      user[data[0]] = data[1];
    } //for
    user["role"] = "user";
    console.log(user);
    checkUserExists(user);
  }

  async function checkUserExists(user) {
    let response = await axios("http://localhost:3000/users");
    let data = await response.data;
    let filteredData = data.filter((e) => e.emailid === user.emailid);
    if (filteredData.length >= 1) {
      console.log("Already exists");
      setSignupStatus("failed");
    } else {
      console.log("New user");
      addUser(user);
    }
  }

  async function addUser(user) {
    await axios.post("http://localhost:3000/users", user);
    setSignupStatus("success");
  }

  function handleLoginClick() {
    props.onLoginButtonClick();
  }

  function handleCloseClick() {
    props.onCloseButtonClick();
  }

  return (
    <>
      {signupStatus === "success" && (
        <div className="text-center text-danger">
          Signed up successfully. You may{" "}
          <a href="#" onClick={handleLoginClick}>
            login
          </a>{" "}
          now.
        </div>
      )}
      {signupStatus === "failed" && (
        <div className="text-center text-danger">
          Sorry... This email-id is already registered.
        </div>
      )}
      {(signupStatus === "no" || signupStatus === "failed") && (
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center">
           
            
          </div>
          
          <div className="row justify-content-center">
            
            <div className="col-sm-12 col-md-6 border border-3 border-danger  justify-content-center ">
           
              <form
                className="loginForm"
                onSubmit={(event) => {
                  handleSignupFormSubmit(event);
                }}
              >
                <div className="text-end"><button
              className="btn btn-close  "
              onClick={handleCloseClick}
              aria-label="Close"
            ></button></div>
                 <div className="text-danger my-3 align-content-center text-center">SIGNUP</div>
                 
                <div className="row">
                  <div className="col-sm-4 col-6 my-2 text-end">Name</div>
                  <div className="col-6 my-2">
                    <input type="text" name="name" required />
                  </div>
                  <div className="col-sm-4 col-6 my-2 text-end">Email-id</div>
                  <div className="col-6 my-2">
                    <input type="email" name="emailid" required />
                  </div>
                  <div className="col-sm-4 col-6 my-2 text-end">Password</div>
                  <div className="col-6 my-2">
                    <input
                      type="password"
                      name="password"
                      maxLength="10"
                      minLength="5"
                      required
                    />
                  </div>
                  <div className="col-sm-4 col-6 my-2 text-end"></div>
                  <div className="col-6 my-2">
                    <input
                      className="btn btn-danger"
                      type="submit"
                      value="Submit"
                    />{" "}
                    <input
                      className="btn btn-danger"
                      type="reset"
                      value="Clear"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignupPage;
