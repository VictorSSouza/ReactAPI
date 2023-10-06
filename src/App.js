import React, { useState, useEffect} from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

import formLogo from './assets/formulario.png';

function App() {

  const baseUrl = "https://localhost:44336/api/Category";
  
  const [data, setData]=useState([]);
  const [modalInsert, setModalInsert] = useState(false);

  const [categorySelected, setCategorySelected] =useState({
    id: '',
    name: '',
    imageUrl: ''
  })

  const openCloseModalInsert=()=>{
    setModalInsert(!modalInsert);
  }

  const handleChange = e=>{
    const {name,value} = e.target;
    setCategorySelected({
      ...categorySelected, [name]:value
    });
    console.log(categorySelected);
  }

  const requestGet = async() => {
    try {
      const response = await axios.get(baseUrl);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const requestPost = async() => {
      delete categorySelected.id;
      await axios.post(baseUrl, categorySelected)
      .then(response=>{
        setData(data.concat(response.data));
        openCloseModalInsert();
      }).catch(error=>{
        console.log(error);
      })
  }

  useEffect(()=>{
    requestGet();
  })

  return (
    <div className="category-container">
      <br/>
      <h1>Cadastro de Categorias</h1>
      <header>
        <img src={formLogo} alt="Cadastro" />
        <button className="btn btn-success" onClick={()=>openCloseModalInsert()}>Incluir Categoria</button>
      </header>
      <table className="table table-bordered">
        <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Url da Imagem</th>
                <th>Operação</th>
              </tr>
        </thead>
        <tbody>
            {data.map(category =>(
                <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.imageUrl}</td>
                    <td>
                        <button className="btn btn-primary">Editar</button>{" "}
                        <button className="btn btn-danger">Excluir</button>
                    </td>
                </tr>
            ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsert}>
        <ModalHeader>Incluir Categorias</ModalHeader>

        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input type="text" className="form-control" name="name" onChange={handleChange} />
            <br />
            <label>Url da imagem:</label>
            <br />
            <input type="text" className="form-control" name="imageUrl" onChange={handleChange}/>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>requestPost()}>Incluir</button>{" "}
          <button className="btn btn-danger" onClick={()=>openCloseModalInsert()}>Cancelar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
