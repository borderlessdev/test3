import express from 'express';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

const { DAppClient } = pkg;
// Configurações
const app = express();
const port = process.env.PORT || 3000; // Use a porta definida no ambiente ou 3000

app.get('/auction', async (req, res) => {
  try {
    // definindo as variaveis
    const private_key = "edskS55SstJHyYXDJY2qZ8TT1s35ZqGtYqVPPyKiu5rkUhP6nfkWfWiFNhaDjcnY1uwYzho4yZAMAygPwQuawutZDtRrrcgWUZ"
    const Tezos = new TezosToolkit("https://ghostnet.ecadinfra.com")
    Tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(private_key) });
    const contrato = "KT1EFLadgpu6EjSh4qrQP1BsxGyjP3cHh6cu"
    // Função de aceitar
    const contract = Tezos.wallet.at(contrato)
    const op = await contract.methods.finalize_auction(1, 5, 1);
    
    res.status(200).json({ message: 'Transação aceita' });
      } catch (error) {
        console.error('Error', error)
        res.status(500).json({ error: 'An error occurred'})
      }
    });

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
