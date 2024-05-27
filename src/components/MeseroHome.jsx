import { Navigate, useNavigate } from "react-router-dom";
import './styles/UserHome.css';
import { useEffect, useState } from "react";

function MeseroHome({ user }) {
    if (user.role !== "mesero" || !user.role) {
        return <Navigate to="/" />
    }
    const home = useNavigate();
    const [productos, setProductos] = useState([])
    const [productoSeleccionado, setProductoSeleccionado] = useState([])
    const [productosSeleccionados, setProductosSeleccionados] = useState([])
    const [mesaSeleccionada, setMesaSeleccionada] = useState("");
    const [cantidad, setCantidad] = useState(1)
    const [mensaje, setMensaje] = useState("")
    const [totalPedido, setTotalPedido] = useState(0)

    const mesas = [
        { id: 1, nombre: 'Mesa 1' },
        { id: 2, nombre: 'Mesa 2' },
        { id: 3, nombre: 'Mesa 3' },
        { id: 4, nombre: 'Mesa 4' },
        { id: 5, nombre: 'Mesa 5' },
    ]

    const cargarProductos = async () => {
        let data = await fetch('https://restaurante-back.vercel.app/v1/restaurante/productos/listar')
            .then(data => data.json())
            .then(res => res)

        setProductos(data)
    }

    function goHome() {
        home("/");
    }

    const enviarPedido = async (e) => {
        e.preventDefault();
        let producto = productos.find(p => p.id == productoSeleccionado);

        // Comprobamos si el producto ya está en la lista de productos seleccionados
        const productoExistenteIndex = productosSeleccionados.findIndex(p => p.id === producto.id);

        if (productoExistenteIndex !== -1) {
            // Si el producto ya está en la lista, aumentamos la cantidad según la cantidad seleccionada
            const updatedProductosSeleccionados = [...productosSeleccionados];
            updatedProductosSeleccionados[productoExistenteIndex].cantidad += parseInt(cantidad); // Aumentar según la cantidad seleccionada
            setProductosSeleccionados(updatedProductosSeleccionados);
        } else {
            // Si el producto no está en la lista, lo agregamos como nuevo con la cantidad seleccionada
            let dataProducto = {
                id: producto.id,
                nombre: producto.nombre,
                cantidad: parseInt(cantidad),
                precio: producto.precio
            };

            setProductosSeleccionados([...productosSeleccionados, dataProducto]);
        }

        console.log("data producto:", producto);
        console.log("Mesa seleccionada:", mesaSeleccionada);
        console.log("producto seleccionado:", productoSeleccionado);
    };


    const calcularTotalPedido = () => {
        let total = 0;
        productosSeleccionados.forEach(producto => {
            total += producto.cantidad * producto.precio;
        });
        setTotalPedido(total);
    };


    const finalizarPedido = async () => {
        let pedido = {
            estado: "procesando",
            mesa: mesaSeleccionada,
            mesero: user.nombre,
            total: totalPedido,
            pedido: productosSeleccionados
        }

        fetch(`https://restaurante-back.vercel.app/v1/restaurante//pedidos/crear-pedido`, {
            'method': 'POST',
            'body': JSON.stringify(pedido),
            'headers': {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .catch((error) => console.error('Error:', error))
            .then((response) => {
                setMensaje(response.mensaje)
                setProductoSeleccionado([])
                setProductosSeleccionados([])
                setMesaSeleccionada(0)
                setCantidad(0)
                setTotalPedido(0)
            });
    }

    const disminuirCantidadProducto = (id) => {
        // Busca el índice del producto en la lista de productos seleccionados
        const productoIndex = productosSeleccionados.findIndex(p => p.id === id);

        // Verificar si el producto está en la lista
        if (productoIndex !== -1) {
            const updatedProductosSeleccionados = [...productosSeleccionados];
            // Verificar si la cantidad es mayor que 1 para disminuir
            if (updatedProductosSeleccionados[productoIndex].cantidad > 1) {
                updatedProductosSeleccionados[productoIndex].cantidad -= 1;
                setProductosSeleccionados(updatedProductosSeleccionados);
            } else {
                // Si la cantidad es 1, elimina el producto de la lista
                updatedProductosSeleccionados.splice(productoIndex, 1);
                setProductosSeleccionados(updatedProductosSeleccionados);
            }
        }
    };


    useEffect(() => {
        cargarProductos();
        setProductosSeleccionados([]);
        setTotalPedido(0); // Reiniciar el total del pedido cuando se carguen nuevos productos
    }, []);

    // Este efecto se ejecuta cada vez que productosSeleccionados se actualice
    useEffect(() => {
        calcularTotalPedido();
    }, [productosSeleccionados]);


    return (
        <div className="my-2 mx-5">
            <div className="alert alert-success" role="alert">
                {mensaje}
            </div>
            <div className="row g-2 ">
                <div className="col-8 mx-auto" >
                    <form onSubmit={enviarPedido}>
                        <div className="row g-4">
                            <div className="mb-3 col-4">
                                <label htmlFor="precio" className="form-label">Mesa</label>
                                <select name="mesa" id="mesa" className="form-control" value={mesaSeleccionada} onChange={(e) => setMesaSeleccionada(e.target.value)}>
                                    <option value="0">Seleccione una mesa</option>
                                    {mesas.map(mesa =>
                                        <option key={mesa.id} value={mesa.id}>{mesa.nombre}</option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-3 col-5">
                                <label htmlFor="productos" className="form-label">Productos</label>
                                <select name="producto" id="producto" className="form-control" value={productoSeleccionado} onChange={(e) => setProductoSeleccionado(e.target.value)}>
                                    <option value="0">Seleccione un producto</option>
                                    {productos.map(producto =>
                                        <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-3 col-3">
                                <label htmlFor="Cantidad" className="form-label">Cantidad</label>
                                <input
                                    value={cantidad}
                                    type="number"
                                    className="form-control"
                                    id="cantidad"
                                    min={1}
                                    onChange={(e) => setCantidad(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="">
                            <button type="submit" className="btn btn-primary ml-4 mx-3">Agregar a Pedido</button>
                            <button type="button" onClick={finalizarPedido} className="btn btn-success ml-5">Finalizar Pedido</button>
                        </div>
                    </form>
                </div>

                <div className="col-8 mt-3 mx-auto" >
                    <div className="table-responsive" >
                        <table className="table table-primary" >
                            <thead>
                                <tr>
                                    <th scope="col">Producto</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosSeleccionados.map((producto, index) =>
                                    <tr key={index} className="">
                                        <td scope="row">{producto.nombre}</td>
                                        <td>{producto.cantidad}</td>
                                        <td>$ {producto.precio}</td>
                                        <td>
                                            <button className="btn btn-danger pt-0 pb-0" onClick={() => disminuirCantidadProducto(producto.id)}>X</button>
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td scope="row" colSpan={3} className="text-left">Total</td>
                                    <td>$ {totalPedido}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
            <button className="btn btn-secondary" onClick={goHome}>Home</button>
        </div>
    )
}

export default MeseroHome;
