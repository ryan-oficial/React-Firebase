import React, { useEffect, useState } from 'react';
import { Table, Button,Container, Row, Cal, Card, Form} from 'react-bootstrap';
import { db, storage } from '../../utils/firebaseConfig';
import FileUploader from 'react-firebase-file-uploader';

const EventosPage = () => {
    const [id, setId] = useState(0);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [urlImagem, setUrlImagem] = useState('');

    const [eventos, setEventos] = useState([]);


    const _dbEventos = db.collection('eventos');

    useEffect(() => {
        listarEventos();
    }, [])

    const listarEventos = () => {
        try {
            db.collection('eventos')
            .get()
            .then(result => {
                // console.log('Collection Eventos', result.docs);
                const data = result.docs.map(doc =>{
                    return {
                        id : doc.id,
                        nome : doc.data().nome,
                        descricao : doc.data().descricao,
                        urlImagem : doc.data().urlImagem
                }
                });
                setEventos(data)
            })
            .catch(error => console.error(error));
        } catch (error) {
            console.error(error);
        }
    }

    const editar = (event) => {
        event.preventDefault();
        try {
            // db.collection('eventos')
            _dbEventos.doc(event.target.value)
            .get()
            .then(result => {
                setId(result.id);
                setNome(result.data().nome);
                setDescricao(result.data().descricao);
                setUrlImagem(doc.data().urlImagem)
            })
        } catch (error) {
            console.error(error)
        }
    }
    const remover = (event) => {
        event.preventDefault();
        try {
            
                _dbEventos.doc(event.target.value)
                .delete()
                .then(() => {
                    alert('Evento removido')
                    listarEventos();
                    limparCampos();
                })

        } catch (error) {
            console.error(error);
        }
    }
    const salvar = (event) => {
        event.preventDefault();

       try {
        const evento = {
            nome : nome,
            descricao : descricao,
            urlImagem : urlImagem,
        }
        if(id === 0){
            db.collection('eventos')
            .add(evento)
            .then(() => {
                alert('Evento cadastrado')
                listarEventos();
                limparCampos();
            })
            .catch(error => {
                console.error(error);
            })
        }else{
            db.collection('eventos')
            .doc(id)
            .set(evento)
            .then(() => {
                alert('Evento alterado')
                listarEventos();
                limparCampos();
            })
        }

        console.log('Dados ${nome} ${descricao}')
       } catch (error) {
           console.error(error)
       }
    }

    const limparCampos = () => {
        setId(0);
            setNome('');
            setUrlImagem('');
            // setLink('');
            // setCategoriaId('');
            setDescricao('');

    }

    const handleUploadError = error =>{
        console.error(error);
    }
 
    const handleUploadSuccess = filename => {
        console.log('Sucesso upload: '+ filename)

        storage
        .ref('imagens')
        .child(filename)
        .getDownloadURL()
        .then(url => setUrlImagem(url))
        .catch(error => console.error(error))
    }
    return(
        <div>
            <Container>

                <h1>Eventos</h1>
                <p>Gerencie seus eventos</p>
                {/* <Titulo titulo="Eventos" chamada="Gerencie seus eventos" /> */}
                
                <Card>
                        <Card.Body>
                            
                            <Form onSubmit={event => salvar(event)}>
                              <Form.Group>
                                  {urlImagem && <img src={urlImagem} style={{width : '200px'}}/>}
                                  <label style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer'}}>
                                            Selecione a imagem
                                    <FileUploader
                                        hidden
                                        accept="image/s"
                                        name="urlImagem"
                                        randomizeFilename
                                        storageRef={storage.ref('imagens')}
                                        onUploadError={handleUploadError}
                                        onUploadSuccess={handleUploadSuccess}
                                    />
                              </label>
                              </Form.Group>
                                <Form.Group controlId="formNome">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control type="text" value={nome} onChange={event => setNome(event.target.value)}/>
                                </Form.Group>
                                
                                {/* <Form.Group controlId="formLink">
                                    <Form.Label>Link</Form.Label>
                                    <Form.Control type="text" value={Link} onChange={event => setLink(event.target.value)} placeholder="http://"/>
                                </Form.Group>
                                
                                <Form.Group controlId="fromImagem">
                                    <Form.File id="fileEvento" label="Imagem do evento" onChange={event => uploadFile(event)} />
                                    {urlImagem && <img src={urlImagem} style={{ width : '160px'}}/>}
                                </Form.Group> */}

                                <Form.Group controlId="formDescricao">
                                    <Form.Label>Descriçao</Form.Label>
                                    <Form.Control type="text" value={descricao} onChange={event => setDescricao(event.target.value)}/>
                                </Form.Group>

                                {/* <Form.Group controlId="formCategoria">
                                    <Form.Label>Categoria</Form.Label>
                                    <Form.Control as="select" value={categoriaId} onChange={event => setCategoriaId(event.target.value)}>
                                        <option value={0}>Selecione</option>
                                            {
                                                categorias.map((item, index) => {
                                                    return(
                                                        <option key={index} value={item.id}></option>
                                                        )
                                                    })
                                           }    
                                     </Form.Control>                         
                                </Form.Group> */}

                                <Button type="submit" >Salvar</Button>
                            </Form>
                        </Card.Body>
                </Card>
                <Card>
                                           <Card.Body>
                                               <Table bordered>
                                                   <thead>
                                                       <tr>
                                                           <th>Imagem</th>
                                                           <th>Nome</th>
                                                           {/* <th>Link</th> */}
                                                           <th>Descrição</th>
                                                           {/* <th>Categoria</th> */}
                                                           <th>Açoes</th>                                                       
                                                       </tr>
                                                   </thead>
                                                   <tbody>
                                                       { eventos && 
                                                       eventos.map((item, index) =>{
                                                           return(
                                                               <tr key={index}>
                                                                   <td><img src={item.urlImagem} style={{ width : '120px'}}></img></td>
                                                                   <td>{item.nome}</td>
                                                                   {/* <td><a href={item.link} target="_blank">Ir para o Evento</a></td> */}
                                                                   <td>{item.descricao}</td>
                                                                   {/* <td>{item.categoria.nome}</td> */}
                                                                   <td>
                                                                       <Button type="button" variant="warning" value={item.id} onClick={ event => editar(event)}>Editar</Button>
                                                                       <Button type="button" variant="danger" value={item.id} style={{ marginleft : '30px'}} onClick={ event => remover(event)}>Remover</Button>
                                                                   </td>
                                                                   </tr>
                                                           )
                                                       })
                                                       }
                                                   </tbody>
                                               </Table>
                                           </Card.Body>

                </Card>
            </Container>
  </div>
  
    )
}

export default EventosPage;