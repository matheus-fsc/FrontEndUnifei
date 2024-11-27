import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPencil, FaTrashCan } from 'react-icons/fa6';
import './CrudUsuarios.css';

export default function CrusUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [altura, setAltura] = useState("");
    const [peso, setPeso] = useState("");
    const [operacao, setOperacao] = useState("");

    //const url = "http://localhost:9082/usuarios/";
    const url = "https://backend-aulaweb-dusky.vercel.app/usuarios/"

    useEffect(() => {
        fetch(url)
            .then((respFetch) => respFetch.json())
            .then((respJson) => setUsuarios(respJson))
            .catch((e) => console.log(e));
    }, []);

    function novosDados() {
        setOperacao("criarRegistro");
    }

    function limparDados() {
        setId("");
        setNome("");
        setEmail("");
        setAltura("");
        setPeso("");
        //setOperacao("");
    }

    function editarDados(cod) {
        let usuario = usuarios.find((item) => item.id === cod);
        const { id, nome, email, altura, peso } = usuario;
        setOperacao("editarRegistro");
        setId(id);
        setNome(nome);
        setEmail(email);
        setAltura(altura);
        setPeso(peso);
    }

    function apagarDados(cod) {
        axios.delete(url + cod)
            .then(() => setUsuarios(usuarios.filter(item => item.id !== cod)))
            .catch((erro) => console.log(erro));
    }

    function gravarDados() {
        if (nome !== "" && email !== "") {
            if (operacao === "criarRegistro") {
                axios.post(url, {
                    nome: nome,
                    email: email,
                    altura: altura || null,
                    peso: peso || null,
                })
                    .then((response) => atualizaListaComNovoUsuario(response))
                    .catch((err) => console.log(err));
            } else if (operacao === "editarRegistro") {
                axios.put(url + id, {
                    id: id,
                    nome: nome,
                    email: email,
                    altura: altura || null,
                    peso: peso || null,
                })
                    .then((response) => atualizaListaUsuarioEditado(response))
                    .catch((err) => console.log(err));
            }
        } else {
            console.log("Preencha os campos");
        }
    }

    function atualizaListaUsuarioEditado(response) {
        if (response.status === 202) {
            const index = usuarios.findIndex(item => item.id === id);
            let users = [...usuarios];
            users[index] = { id, nome, email, altura, peso };
            setUsuarios(users);
            limparDados();
        } else {
            console.log("Problema com edição: ", response.status);
        }
    }

    function atualizaListaComNovoUsuario(response) {
        console.log(response);
        let { id, nome, email, altura, peso } = response.data;
        let obj = { id, nome, email, altura, peso };
        setUsuarios([...usuarios, obj]);
        limparDados();
    }

    return (
        <div id="containerGeral">
            <button type="button" onClick={novosDados}>Novo</button>
            <input
                type="text"
                name="txtNome"
                value={nome}
                placeholder="Nome"
                onChange={(e) => setNome(e.target.value)}
            />
            <input
                type="text"
                name="txtEmail"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="number"
                name="txtAltura"
                value={altura}
                placeholder="Altura (cm)"
                onChange={(e) => setAltura(e.target.value)}
            />
            <input
                type="number"
                name="txtPeso"
                value={peso}
                placeholder="Peso (kg)"
                onChange={(e) => setPeso(e.target.value)}
            />
            <div>
            <button type="button" onClick={limparDados}>Cancelar</button>
            <button type="button" onClick={gravarDados}>Gravar</button>
            </div>

            {usuarios.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Altura</th>
                            <th>Peso</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.nome}</td>
                                <td>{item.email}</td>
                                <td>{item.altura}</td>
                                <td>{item.peso}</td>
                                <td>
                                    <FaPencil onClick={() => editarDados(item.id)} />
                                    <FaTrashCan onClick={() => apagarDados(item.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhum usuário encontrado.</p>
            )}
        </div>
    );
}
