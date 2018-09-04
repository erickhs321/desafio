import React, { Component } from 'react';
import jsonPedidos from '../data/events.json';
import groupBy from 'json-groupby';
import Moment from 'moment';
import css from '../css/main.css';
const data = jsonPedidos.events;

class Pedidos extends Component {

    render() {

        let id = 0;
        let loja = 0;
        let valor = 0;
        let dataHora = 0;
        let separadoPorEventos = groupBy(data, ['event']);
        let comprou = separadoPorEventos['comprou'];
        let comprouProduto = separadoPorEventos['comprou-produto'];
        let produtos = [];
        let novoArray = [];
        const customData = 'custom_data';
        const transactionId = 'transaction_id';
        const revenue = 'revenue';
        const timestamp = 'timestamp';
        const productName = 'product_name';
        const productPrice = 'product_price';

        //repetindo pelo comprimento do array (2)
        for (let i = 0; i < comprou.length; i++) {
            
            //percorrendo array custom data 
            for (let j = 0; j < comprou[i][customData].length; j++) {

                if (comprou[i][customData][j].key === transactionId) {

                    id = comprou[i][customData][j].value;
                    produtos = acharProdutos(id);
                } else {
                    loja = comprou[i][customData][j].value;
                }
            }
            valor = comprou[i][revenue];
            dataHora = comprou[i][timestamp];
            //junçao dos dados das respectivas compra em  novoArray
            novoArray.push({
                transaction_id: id,
                store_name: loja,
                revenue: valor,
                timestamp: dataHora,
                product_names: produtos

            });
        }
        console.log(novoArray);

        //função que busca e retorna produtos da transação pelo id fornecido
        function acharProdutos(transaction_id) {
            let posicaoIdTransacao = 0;
            let produtos = [];

            //percorrendo array comprouProdutos
            for (let i = 0; i < comprouProduto.length; i++) {
                let p1 = 0;
                let p2 = 0;
                let preco = 0;
                let nomeProduto = 0;

                //percorrendo array custom data 
                for (let j = 0; j < comprouProduto[i][customData].length; j++) {
                    if (comprouProduto[i][customData][j].key === transactionId && comprouProduto[i][customData][j].value === transaction_id) {
                        posicaoIdTransacao = j;

                        //verificação da posição do id transação
                        switch (posicaoIdTransacao) {
                            case 0:
                                p1 = posicaoIdTransacao + 1;
                                p2 = posicaoIdTransacao + 2;
                                break;
                            case 1:
                                p1 = posicaoIdTransacao - 1;
                                p2 = posicaoIdTransacao + 1;
                                break;
                            default:
                                p1 = posicaoIdTransacao - 1;
                                p2 = posicaoIdTransacao - 2;
                                break;
                        }

                        //pegando dados dos produtos e os jogando  no array produtos
                        if (comprouProduto[i][customData][p1].key === productName) {
                            nomeProduto = comprouProduto[i][customData][p1].value;
                        }
                        if (comprouProduto[i][customData][p1].key === productPrice) {
                            preco = comprouProduto[i][customData][p1].value;
                        }

                        if (comprouProduto[i][customData][p2].key === productName) {
                            nomeProduto = comprouProduto[i][customData][p2].value;
                        }
                        if (comprouProduto[i][customData][p2].key === productPrice) {
                            preco = comprouProduto[i][customData][p2].value;
                        }
                        produtos.push({ 'nome': nomeProduto, 'preco': preco });
                    }

                }
            }
            return produtos;
        }

        //exibindo na tela os dados
        return (
            <ul class='container linha-do-tempo'>
                {
                    novoArray.map((eventos, index) =>

                        <div class="container" >
                            <li>
                                <div class="infos">
                                    <span>
                                        {
                                            Moment(eventos[timestamp]).format('DD/MM/YYYY HH:mm')
                                        }

                                    </span>
                                    <span>
                                        {
                                            formatarMoeda(eventos[revenue])
                                        }
                                    </span>
                                    <span>{eventos['store_name']}</span>
                                </div>
                                <div>
                                    <table cellPadding="0" cellSpacing="0">
                                        <thead>
                                            <tr>
                                                <th>Produto</th>
                                                <th>Preço</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            {
                                                eventos['product_names'].map((data, index) =>
                                                    <tr>
                                                        <td>{data.nome}</td>
                                                        <td>
                                                            {
                                                                formatarMoeda(data.preco)
                                                            }
                                                        </td>
                                                    </tr>
                                                )

                                            }
                                        </tbody>
                                    </table>

                                </div>
                            </li>
                        </div>
                    )
                }
            </ul>
        )
    }
}
//função para formatar para valor monetário do brasil
function formatarMoeda(valor) {
    return 'R$ ' + ((valor).toFixed(2).replace('.', ','))
}

export default Pedidos

