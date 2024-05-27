import './styles/Form.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ callback }) => {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const goTo = useNavigate();

    const validateUser = (event) => {
        event.preventDefault();
        fetch(`https://restaurante-back.vercel.app/v1/restaurante/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(responseData => {
                if (responseData.role == "admin") {
                    callback(responseData);
                    goTo("/adminHome");
                } else if (responseData.role == "mesero") {
                    callback(responseData);
                    goTo("/meseroHome");
                } else if (responseData.role == "cocina") {
                    callback(responseData);
                    goTo("/cocinaHome");
                }
            })

    }

    return (
        <div>
            <form onSubmit={validateUser}>
                <h1 id="txtBienvenida">Bienvenido a Antojitos </h1>
                <h4 className="txt">Nombre de Usuario</h4>
                <input type="text" className="entry" onChange={(e) => setUsername(e.target.value)} /><br></br>
                <h4 className="txt">Contraseña</h4>
                <input type="password" className="entry" onChange={(e) => setPassword(e.target.value)} /><br></br>
                <input type="submit" value="Ingresar" id="btnEnviar" />
            </form>
        </div>
    )

}
export default Login;