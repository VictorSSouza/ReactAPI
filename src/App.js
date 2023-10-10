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
  const [modalEdit, setModalEdit] = useState(false);

  const [categorySelected, setCategorySelected] =useState({
    id: '',
    name: '',
    imageUrl: ''
  })

  const categorySelect = (category, option)=>{
    setCategorySelected(category);
      (option === "Editar") &&
      openCloseModalEdit();
  }

  const openCloseModalInsert=()=>{
    setModalInsert(!modalInsert);
  }

  const openCloseModalEdit=()=>{
    setModalEdit(!modalEdit);
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

  const requestPut = async()=>{
    await axios.put(baseUrl+"/"+categorySelected.id, categorySelected)
    .then(response=>{
      var reply =response.data;
      var dataAuxiliares = data;
      dataAuxiliares.map(category=>{
        if(category.id===categorySelected.id){
          category.name = reply.name;
          category.imageUrl = reply.imageUrl;
        }
      });
      openCloseModalEdit();
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
                        <button className="btn btn-primary" onClick={()=>categorySelect(category, "Editar")}>Editar</button>{" "}
                        <button className="btn btn-danger" onClick={()=>categorySelect(category, "Excluir")}>Excluir</button>
                    </td>
                </tr>
            ))}
        </tbody>
      </table>
      {/*Incluir Categorias*/}
      <Modal isOpen={modalInsert}>
        <ModalHeader>Incluir Categorias</ModalHeader>

        <ModalBody>
          <div className="form-group">
            <label>Nome: </label><br />
            <input type="text" className="form-control" name="name" onChange={handleChange} />
            <br />
            <label>Url da imagem: </label><br />
            <input type="text" className="form-control" name="imageUrl" onChange={handleChange}/>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>requestPost()}>Incluir</button>{" "}
          <button className="btn btn-danger" onClick={()=>openCloseModalInsert()}>Cancelar</button>
        </ModalFooter>
      </Modal>
      {/* Editar Categoria */}
      <Modal isOpen={modalEdit}>
        <ModalHeader>Editar Categoria</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Id: </label><br/>
            <input type="text" className="form-group"
            readOnly value={categorySelected && categorySelected.id} />
            <br/>
            <label>Nome: </label><br/>
            <input type="text" className="form-control" name="name" onChange={handleChange} 
                   value={categorySelected && categorySelected.name} />
            <br/>
            <label>Url da imagem: </label><br/>
            <input type="text" className="form-control" name="imageUrl" onChange={handleChange} 
                   value={categorySelected && categorySelected.imageUrl} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>requestPut()}>Editar</button>{" "}
          <button className="btn btn-danger" onClick={()=>openCloseModalEdit()}>Cancelar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
