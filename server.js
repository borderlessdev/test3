import express from 'express';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import aws from 'aws-sdk';
import EventEmitter from 'events';

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const contrato = "KT1VVytMNaJBgyBDQqE99xwvMChd8z6Rk8Tg";
const Tezos = new TezosToolkit("https://ghostnet.ecadinfra.com");

const privateKey = new aws.S3({
  privateKey: process.env.privateKey
});

const chave = "edskS55SstJHyYXDJY2qZ8TT1s35ZqGtYqVPPyKiu5rkUhP6nfkWfWiFNhaDjcnY1uwYzho4yZAMAygPwQuawutZDtRrrcgWUZ"

const eventEmitter = new EventEmitter();

// Função para fechar o leilão
async function fecharLeilao(auction_id, edition, token_id) {
  try {
    // Settando quem irá aceitar as transações
    Tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(chave) });

    // Settando o contrato
    const contract = await Tezos.wallet.at(contrato);

    // Realize as operações necessárias para fechar o leilão
    const op = await contract.methods.finalize_auction(auction_id, edition, token_id).send();

    console.log(`Leilão fechado com sucesso - auction_id: ${auction_id}, edition: ${edition}, token_id: ${token_id}`);
  } catch (error) {
    console.error('Erro ao fechar o leilão', error);
  }
}

// Rota para agendar o fechamento do leilão com base no tempo
app.post('/fechar-leilao', (req, res) => {
  try {
    const { auction_id, edition, token_id, time } = req.body;

    // Verifique se o tempo é um número válido
    if (!isNaN(time)) {
      // Agende o fechamento do leilão após o tempo especificado
      setTimeout(() => {
        fecharLeilao(auction_id, edition, token_id);
      }, time);

      res.status(200).json({ message: 'Fechamento do leilão agendado com sucesso' });
    } else {
      res.status(400).json({ message: 'Tempo inválido' });
    }
  } catch (error) {
    console.error('Erro ao agendar o fechamento do leilão', error);
    res.status(500).json({ error: 'Um erro ocorreu' });
  }
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
