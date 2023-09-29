import express from 'express';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import aws from 'aws-sdk'

// Configurações
const app = express();
app.use(express.json())
const port = process.env.PORT || 3000; // Use a porta definida no ambiente ou 3000

const contrato = "KT1EFLadgpu6EjSh4qrQP1BsxGyjP3cHh6cu"
const Tezos = new TezosToolkit("https://ghostnet.ecadinfra.com")

const privateKey = new aws.S3({
  privateKey: process.env.privateKey
})
const chave = "edskS55SstJHyYXDJY2qZ8TT1s35ZqGtYqVPPyKiu5rkUhP6nfkWfWiFNhaDjcnY1uwYzho4yZAMAygPwQuawutZDtRrrcgWUZ"

app.post('/auction', async (req, res) => {
  try {
    // settando quem irá aceitar as transações
    Tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(privateKey.config.privateKey) });

    // settando o contrato
    const contract = await Tezos.wallet.at(contrato)

    // requisitando os dados necessarios
    const { auction_id, edition, token_id } = req.body

    // passando para a função finalize
    const op = await contract.methods.finalize_auction(auction_id, edition, token_id).send();
    res.status(200).json({ message: `Transação aceita, op Hash:  ${op.opHash}` });
      } catch (error) {
        console.error('Error', error)
        res.status(500).json({ error: 'An error occurred'})
      }
    });



// iniciando o servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
