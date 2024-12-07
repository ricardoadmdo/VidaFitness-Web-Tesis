import './styles.css';
import { useState } from 'react';
import Axios from 'axios'
import Swal from 'sweetalert2'


const CRUDUsuarios = () => {
  const [nombre, setNombre] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [usuario, setUsuario] = useState("")
  const [rol, setRol] = useState("")
  const [id, setId] = useState("")

  const [usuarios, setUsuarios] = useState([]);
  const [editar, setEditar] = useState(false);



  const add = () => {
    Axios.post("http://localhost:3001/api/usuarios",
      { nombre, contrasena, usuario, rol }
    ).then(() => {
      getUsuarios()
      limpiarCampos()
      Swal.fire({
        title: "Registro exitoso!",
        html: `<i>El usuario <strong>${nombre}</strong> se ha registrado con éxito!</i>`,
        icon: "success",
        timer: 3000
      });
    })
  }

  const update = () => {
    Axios.put(`http://localhost:3001/api/usuarios/${id}`,
      { nombre, contrasena, usuario, rol }
    ).then(() => {
      getUsuarios()
      limpiarCampos()
      Swal.fire({
        title: "Actualizcion exitosa!",
        html: `<i>El usuario <strong>${nombre}</strong> se ha actulizado con éxito!</i>`,
        icon: "success",
        timer: 3000
      });
    })
  }
  const deleteUsuario = (usuario) => {
    Swal.fire({
      title: `¿Está seguro que desea eliminar el usuario <strong>${usuario.nombre}</strong> ?`,
      text: "El usuario será eliminado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/api/usuarios/${usuario.id}`).then(() => {
          getUsuarios()
          limpiarCampos()
          Swal.fire({
            title: "Usuario eliminado!",
            html: `<i>El usuario <strong>${usuario.nombre}</strong> ha sido eliminado con éxito.</i>`,
            icon: "success",
            timer: 3000
          });
        })

      }
    });

  }


  const limpiarCampos = () => {
    setNombre("")
    setContrasena()
    setRol("")
    setUsuario("")
    setId("")
    setEditar(false)
  }


  const editarUsuario = (val) => {
    setEditar(true)
    setNombre(val.nombre)
    setContrasena(val.contrasenae)
    setUsuario(val.usuario)
    setRol(val.rol)
    setId(val.id)
  }


  const getUsuarios = () => {
    Axios.get("http://localhost:3001/api/usuarios").then((response) => {
      setUsuarios(response.data)
    })
  }

  getUsuarios()




  return (
    <div className='App'>
      <div className='datos'>
      </div>

      <div className="card text-center">
        <div className="card-header">
          Gestión de Usuarios
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre</span>
            <input type="text" value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              className="form-control" placeholder="Ingrese su nombre" aria-label="Nombre" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Usuario</span>
            <input type="text" value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              className="form-control" placeholder="Ingrese su usuario" aria-label="Usuario" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Contrasena</span>
            <input type="password"
              value={contrasena}
              onChange={(event) => setContrasena(event.target.value)}
              className="form-control" placeholder="Ingrese su contrasena" aria-label="Contrasena" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Rol</span>
            <input type="text" value={rol}
              onChange={(event) => setRol(event.target.value)}
              className="form-control" placeholder="Ingrese su rol" aria-label="Rol" aria-describedby="basic-addon1" />
          </div>
        </div>

        <div className="card-footer text-body-secondary">
          {
            editar == true ?
              <div>
                <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
                <button className='btn btn-info m-2' onClick={limpiarCampos}>Cancelar</button>
              </div>
              : <button className='btn btn-success' onClick={add}>Registrar</button>

          }
        </div>
      </div>

      <div className='lista'>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre Completo</th>
            <th scope="col">Nombre de usuario</th>
            <th scope="col">Contraseña</th>
            <th scope="col">Rol</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((val, key) => (
            <tr key={key}>
              <th scope="row">{val.id}</th>
              <td>{val.nombre}</td>
              <td>{val.usuario}</td>
              <td>{val.contrasena}</td>
              <td>{val.rol}</td>
              <td>
                <button type='button'
                  onClick={() =>
                    editarUsuario(val)
                  }
                  className='btn btn-primary'>Editar</button>
                <button type='button' className='btn btn-danger' onClick={() => deleteUsuario(val)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

export default CRUDUsuarios