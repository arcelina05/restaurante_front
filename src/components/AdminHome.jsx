import { Navigate, useNavigate } from "react-router-dom";
import './styles/AdminHome.css'
import { useEffect, useState } from "react";

function AdminHome({ user }) {
    if (user.role !== 'admin' || !user.role) {
        return <Navigate to="/" />
    }
    const home = useNavigate();
    //Variables seccion productos
    const [nombre, setNombre] = useState("")
    const [precio, setPrecio] = useState("")
    const [productos, setProductos] = useState([])
    const [productoSeleccionado, setProductoSeleccionado] = useState([])
    const [textoBotonProducto, setTextoBotonProducto] = useState("agregar")
    const [accionProducto, setAccionProducto] = useState("agregar")

    // variable general
    const [mensaje, setMensaje] = useState("")

    // Variables seccion usuarios
    const [nombres, setNombres] = useState("")
    const [password, setPassword] = useState("")
    const [rol, setRol] = useState("")
    const [usuarios, setUsuarios] = useState([])
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState([])
    const [textoBotonUsuario, setTextoBotonUsuario] = useState("agregar")
    const [accionUsuario, setAccionUsuario] = useState("agregar")

    // Inicio Funciones seccion de productos
    // Cargar todos los productos del json
    const cargarProductos = async () => {
        let data = await fetch('https://restaurante-back.vercel.app/v1/restaurante/productos/listar')
            .then(data => data.json())
            .then(res => res)

        setProductos(data)
    }

    // Editar informacion de un producto
    const editarProducto = async (producto) => {
        setTextoBotonProducto('actualizar')
        setAccionProducto('actualizar')
        setNombre(producto.nombre)
        setPrecio(producto.precio)
        setProductoSeleccionado(producto)
    }

    // Eliminar producto
    const eliminarProducto = async (producto) => {
        fetch(`https://restaurante-back.vercel.app/v1/restaurante/productos/eliminar-producto/${producto._id}`, {
            'method': 'DELETE',
            'headers': {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .catch((error) => console.error('Error:', error))
            .then((response) => {
                setMensaje(response.mensaje)
                cargarProductos()
            });
    }

    // Funcion para enviar datos de un nuevo producto o los datos del producto actualizados
    const enviarDatosProducto = async (e) => {
        e.preventDefault();

        // Como se utiliza la misma funcion para crear y actualziar se hace una validacion para saber a que ruta tiene que apuntar cuando se enviar
        let ruta_post = `https://restaurante-back.vercel.app/v1/restaurante/productos/crear-producto`;
        let method = 'POST';
        if (accionProducto == 'actualizar') {
            ruta_post = `https://restaurante-back.vercel.app/v1/restaurante/productos/actualizar-producto/${productoSeleccionado._id}`;
            method = 'PUT';
        }

        let datosProducto = {
            nombre: nombre,
            precio: precio
        }

        fetch(ruta_post, {
            'method': method,
            'body': JSON.stringify(datosProducto),
            'headers': {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .catch((error) => console.error('Error:', error))
            .then((response) => {
                setMensaje(response.mensaje)
                cargarProductos()

                setTextoBotonProducto('agregar')
                setAccionProducto('agregar')
                setNombre("")
                setPrecio("")
                setProductoSeleccionado([])
            });
    }
    // Fin funciones seccion productos


    // Inicio funciones para seccion usuarios
    const cargarUsuarios = async () => {
        let data = await fetch('https://restaurante-back.vercel.app/v1/restaurante/usuarios/listar')
            .then(data => data.json())
            .then(res => res)
        setUsuarios(data)
    }

    const editarUsuario = async (usuario) => {
        setNombres(usuario.nombre)
        setPassword(usuario.password)
        setRol(usuario.role)
        setUsuarioSeleccionado(usuario)
        setTextoBotonUsuario("actualizar")
        setAccionUsuario("actualizar")
    }
    const eliminarUsuario = async (usuario) => {
        fetch(`https://restaurante-back.vercel.app/v1/restaurante/usuarios/eliminar-usuario/${usuario._id}`, {
            'method': 'DELETE',
            'headers': {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .catch((error) => console.error('Error:', error))
            .then((response) => {
                setMensaje(response.mensaje)
                cargarUsuarios()
            });
    }

    const enviarDatosUsuario = async (e) => {
        e.preventDefault();

        // se hace una validacion para saber a que ruta tiene que apuntar cuando se enviar ya que se usa la misma funcion para crear y acrualizar
        let ruta_post = `https://restaurante-back.vercel.app/v1/restaurante/usuarios/crear-usuario`;
        let method = 'POST';
        if (accionUsuario == 'actualizar') {
            ruta_post = `https://restaurante-back.vercel.app/v1/restaurante/usuarios/actualizar-usuario/${usuarioSeleccionado._id}`;
            method = 'PUT';
        }

        let datosUsuario = {
            nombre: nombres,
            password: password,
            role: rol
        }

        fetch(ruta_post, {
            'method': method,
            'body': JSON.stringify(datosUsuario),
            'headers': {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .catch((error) => console.error('Error:', error))
            .then((response) => {
                setMensaje(response.mensaje)
                cargarUsuarios()
                // limpio los campos despues de actualizar
                setNombres("")
                setPassword("")
                setRol("")
                setUsuarioSeleccionado([])
                setTextoBotonUsuario("agregar")
                setAccionUsuario("agregar")
            });
    }
    // Fin funciones para seccion usuarios

    function goHome() {
        home("/");
    }


    // carga los productos,usuarios y ventas despues de haberse renderizado el componente
    useEffect(() => {
        cargarProductos();
        cargarUsuarios();
    }, [])
    return (
        <div className="my-2 mx-5">

            <div className="alert alert-success" role="alert">
                {mensaje}
            </div>

            {/* Seccion productos */}
            <div className="row g-2">
                <div className="col-8 mt-4" >
                    <h5 className="">Productos</h5>
                    <table className="table table-primary table-sm"   >
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto, index) =>
                                <tr key={index} className="">
                                    <td scope="row">{producto.nombre}</td>
                                    <td>{producto.precio}</td>
                                    <td>
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => editarProducto(producto)}
                                            >
                                                editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => eliminarProducto(producto)}
                                            >
                                                eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="col-4">
                    <form onSubmit={enviarDatosProducto}>
                        <div className="mb-2">
                            <label htmlFor="nombre" className="text-right">Nombre</label>
                            <input
                                value={nombre}
                                type="text"
                                className="form-control"
                                id="nombre"
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="precio" className="form-label">Precio</label>
                            <input
                                value={precio}
                                type="text"
                                className="form-control"
                                id="precio"
                                onChange={(e) => setPrecio(e.target.value)}
                            />
                        </div>
                        <div className="">
                            <div className="btn-group">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    {textoBotonProducto}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>


            {/* Seccion usuarios */}
            <div className="row g-2">
                <div className="col-8 mt-4" >
                    <h5 className="">Usuarios</h5>
                    <table className="table table-primary table-sm"   >
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Contraseña</th>
                                <th scope="col">Rol</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario, index) =>
                                <tr key={index} className="">
                                    <td scope="row">{usuario.nombre}</td>
                                    <td>{usuario.password}</td>
                                    <td>{usuario.role}</td>
                                    <td>
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => editarUsuario(usuario)}
                                            >
                                                editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => eliminarUsuario(usuario)}
                                            >
                                                eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="col-4">
                    <form onSubmit={enviarDatosUsuario}>
                        <div className="mb-2">
                            <label htmlFor="nombre" className="text-right">Nombre</label>
                            <input
                                value={nombres}
                                type="text"
                                className="form-control"
                                id="nombre"
                                onChange={(e) => setNombres(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">password</label>
                            <input
                                value={password}
                                type="text"
                                className="form-control"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Rol</label>
                            <input
                                value={rol}
                                type="text"
                                className="form-control"
                                id="rol"
                                onChange={(e) => setRol(e.target.value)}
                            />
                        </div>
                        <div className="">
                            <div className="btn-group">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    {textoBotonUsuario}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <button
                className="btn btn-secondary"
                onClick={goHome}
            >
                Home
            </button>
        </div>

    )
}

export default AdminHome;