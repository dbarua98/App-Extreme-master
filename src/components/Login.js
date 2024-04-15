import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
// import { Button } from 'react-bootstrap';
import Button from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import Validator, { RequiredRule } from 'devextreme-react/validator';

const Login = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false)

    useEffect(() => {
        if (token) {
            navigate("/home")
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            userName: email,
            password: password
        };

        try {
            const response = await fetch('https://localhost:7137/api/Authenticate/Post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            localStorage.setItem('token', responseData.AuthenticateToken);

            console.log(responseData);
            navigate("/home")

        } catch (error) {
            setError(true)
            console.error('Error:', error);
        }
    };



    console.log("email", email)
    return (
        <div className='container vh-100 align-content-center'>
            <div className="  d-flex justify-content-evenly border w-md-75 mx-auto p-1">
                <div className='d-none d-md-block'>
                </div>
                <div className='mt-2'>
                    <h2 className='d-flex justify-content-center'>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            {/* <label htmlFor="email">Email:</label> */}
                            {/* <input  className='border rounded w-auto ms-5  ps-2'
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                }}
              /> */}
                            <TextBox
                                label="Email"
                                labelMode="floating"
                                placeholder="Enter Email"
                                value={email}
                                onValueChange={
                                    useCallback((v) => {
                                        setEmail(v)
                                    }, [])
                                }
                                valueChangeEvent="input"
                                maxLength={20}
                                showClearButton={true}
                                validationMessagePosition="right"
                            >
                                <Validator>
                                    <RequiredRule message="Email is required" />
                                </Validator>
                            </TextBox>


                        </div>
                        <div className='mt-2  '>
                            {/* <label htmlFor="password">Password:</label> */}
                            {/* <input  className='border rounded w-auto ms-4 ps-2'
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
              /> */}
                            <TextBox
                                label="Password"
                                labelMode="floating"
                                mode="password"
                                placeholder="Enter password"
                                value={password}
                                onValueChange={
                                    useCallback((v) => {
                                        setPassword(v)
                                    }, [])
                                }
                                valueChangeEvent="input"
                                maxLength={20}
                                showClearButton={true}
                                validationMessagePosition="right"
                            >
                                <Validator>
                                    <RequiredRule message="Password is required" />
                                </Validator>
                            </TextBox>
                        </div>
                        {<p style={{ fontSize: "x-small", color: "red", marginLeft: "125px" }}>{error ? "Invalid Credential" : ""}</p>}
                        {/* <Button type="submit" style={{ marginLeft: "135px" }} className='my-2'>Login</Button> */}
                        <Button
                            text="Login"
                            //    onClick={handleSubmit}
                            stylingMode="outlined"
                            type="success"
                            icon="comment"
                            useSubmitBehavior={true}
                        />

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
