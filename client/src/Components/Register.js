import { Col, Container, Form, Row, Button } from "reactstrap";
import { userSchemaValidation } from "../Validations/UserValidations";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";

import { useState } from "react";
import {
  addUser,
  deleteUser,
  updateUser,
  registerUser,
} from "../Features/UserSlice";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Register = () => {
  //Retrieve the current value of the state and assign it to a variable.
  const userList = useSelector((state) => state.users.value);

  //Create the state variables
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  //For form validation using react-hook-form
  const {
    register,
    handleSubmit, // Submit the form when this is called
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchemaValidation), //Associate your Yup validation schema using the resolver
  });

  const dispatch = useDispatch();
  const navigate = useNavigate(); //declares a constant variable named navigate and assigns it the value returned by the useNavigate() hook.

  // Handle form submission
  const onSubmit = (data) => {
    try {
      // You can handle the form submission here
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      console.log("Form Data", data); // You can handle the form submission here
      alert("Validation all good.");
      //dispatch(addUser(userData)); //use the useDispatch hook to dispatch an action, passing as parameter the userData
      dispatch(registerUser(userData)); // Dispatch an action to add a new user by passing the user data to the Redux store
      navigate("/login"); //redirect to login component
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (email) => {
    dispatch(deleteUser(email));
  };

  const handleUpdate = (email) => {
    const userData = {
      name: name, //create an object with the values from the state variables
      email: email,
      password: password,
    };
    dispatch(updateUser(userData)); //use the useDispatch hook to dispatch an action, passing as parameter the userData
  };

  return (
    <div>
      <Container fluid>
        <Row className="formrow">
          <Col className="columndiv1" lg="6">
            <Form className="div-form" onSubmit={handleSubmit(onSubmit)}>
              <section className="form">
                <div className="form-group">
                  <input
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name..."
                    type="text"
                    {...register("name", {
                      onChange: (e) => setname(e.target.value),
                    })}
                  />
                  <p className="error">{errors.name?.message}</p>
                </div>

                <div className="form-group">
                  <input
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email..."
                    type="email"
                    {...register("email", {
                      onChange: (e) => setemail(e.target.value),
                    })}
                  />
                  <p className="error">{errors.email?.message}</p>
                </div>

                <div className="form-group">
                  <input
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password..."
                    type="password"
                    {...register("password", {
                      onChange: (e) => setpassword(e.target.value),
                    })}
                  />
                  <p className="error">{errors.password?.message}</p>
                </div>

                <div className="form-group">
                  <input
                    id="confirmpassword"
                    name="confirmpassword"
                    className="form-control"
                    placeholder="Confirm your password..."
                    type="password"
                    {...register("confirmpassword", {
                      onChange: (e) => setconfirmPassword(e.target.value),
                    })}
                  />
                  <p className="error">{errors.confirmpassword?.message}</p>
                </div>

                {/*
                <div className="form-group">
                  <input
                    id="age"
                    name="age"
                    className="form-control"
                    placeholder="Enter your age..."
                    type="text"
                    {...register("age")}
                  />
                  <p className="error">{errors.age?.message}</p>
                </div>

                <div className="form-group">
                  <input
                    id="allowance"
                    name="allowance"
                    className="form-control"
                    placeholder="Enter the allowance..."
                    type="text"
                    {...register("allowance")}
                  />
                  <p className="error">{errors.allowance?.message}</p>
                </div>
              */}

                <Button color="primary" className="button">
                  Register
                </Button>
              </section>
            </Form>
          </Col>

          <Col className="columndiv1" lg="6"></Col>
        </Row>

        <Row>
          {/*
          <Col md={6}>
            <Link to="/listofusers">List of Users</Link>
            <table>
              <tbody>
                {userList.map((user) => (
                  <tr key={user.email}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>
                      <Button onClick={() => handleDelete(user.email)}>
                        Delete User
                      </Button>
                      <Button onClick={() => handleUpdate(user.email)}>
                        Update User
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
                */}
        </Row>
      </Container>
    </div>
  );
};

export default Register;
