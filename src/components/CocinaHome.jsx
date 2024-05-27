import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function CocinaHome({ user }) {
  if (user.role !== "cocina" || !user.role) {
    return <Navigate to="/" />
  }

  const [mensaje, setMensaje] = useState("")
  const [pedidos, setPedidos] = useState([])
  const home = useNavigate();

  const cargarPedidos = async () => {
    let data = await fetch('http://localhost:4000/v1/restaurante/pedidos/listar')
      .then(data => data.json())
      .then(res => res)

    setPedidos(data)
  }

  const cambiarEstadoPedido = (id) => {
    const url = `http://localhost:4000/v1/restaurante/pedidos/actualizar-pedido/${id}`;

    const data = {
      estado: "listo"
    };

    fetch(url, {
      'method': 'PUT',
      'body': JSON.stringify(data),
      'headers': {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .catch((error) => console.error('Error:', error))
      .then((response) => {
        setMensaje(response.mensaje)
        cargarPedidos()
      });
  };

  const goHome =()=> {
    home("/");
  }

  useEffect(() => {
    cargarPedidos();
  }, [])

  return (
    <div className="my-2 mx-5">
      <div className="alert alert-success" role="alert">
        {mensaje}
      </div>
      <h3>Pedidos</h3>
      <div className="row g-2 ">
        <div className="col-12 mx-auto" >
          <div className="table-responsive"  >
            <table className="table table-primary" >
              <thead>
                <tr>
                  <th scope="col">Mesa</th>
                  <th scope="col">Pedido</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido, index) =>
                  <tr key={index} className="">
                    <td scope="row">{pedido.mesa}</td>
                    <td>
                      <ul className="list-unstyled">
                        {pedido.pedido.map(detalle =>
                          <li key={detalle.id}>{detalle.cantidad} - {detalle.nombre}</li>
                        )}
                      </ul>
                    </td>
                    <td>{pedido.estado}</td>
                    <td>
                      <button onClick={() => cambiarEstadoPedido(pedido.id)} className="btn btn-success">Listo</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <button className="btn btn-secondary" onClick={goHome}>Home</button>
    </div>
  )
}

export default CocinaHome