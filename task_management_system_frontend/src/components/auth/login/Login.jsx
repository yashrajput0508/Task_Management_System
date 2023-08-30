import LoginCSS from './Login.module.css';
import { useState } from 'react';
import { Authentication } from '../../../services/authentication';
import ErrorMessage from '../../alerts/ErrorMessage';
import { Navigate, useNavigate } from 'react-router-dom';


export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const response = Authentication(username, password);

        response.then((value) => {
            
            if(value.admin){
                navigate("/admin/dashboard");
            }else{
                navigate("/member/"+value.memberId+"/dashboard");
            }
        }
         , (reason) => {
            setError(true);
        })
    }

    return (
        <>
            <div className={`${LoginCSS.wrapper}`}>
                <div className={`${LoginCSS.logo}`}>
                    <img src="http://www.clker.com/cliparts/d/p/y/e/m/j/sign-in-button-md.png" alt="" className={`${LoginCSS.logoImg}`}/>
                </div>
                <div className={`${LoginCSS.wrapperName} text-center mt-4 `}>
                    Welcome
                </div>
                <form className="p-3 mt-3" onSubmit={handleSubmit}>
                    {error && <ErrorMessage />}
                    <div className={`${LoginCSS.wrapperFormField} d-flex align-items-center`}>
                        <span className="fa fa-user"></span>
                        <input className={`${LoginCSS.wrapperInput}`} type="text" name="username" id="username" placeholder="Username"
                            onChange={(data) => setUsername(data.target.value)}
                            required />
                    </div>
                    <div className={`${LoginCSS.wrapperFormField} d-flex align-items-center`}>
                        <span className="fa fa-key"></span>
                        <input className={`${LoginCSS.wrapperInput}`} type="password" name="password" id="pwd" placeholder="Password"
                            onChange={(data) => setPassword(data.target.value)}
                            required />
                    </div>
                    <button className={`${LoginCSS.wrapperBtn} btn mt-3`}>Login</button>
                </form>
            </div>
        </>
    )
}