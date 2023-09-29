import express from 'express';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

// Configurações
const app = express();
const port = process.env.PORT || 3000; // Use a porta definida no ambiente ou 3000

const private_key = "edskS55SstJHyYXDJY2qZ8TT1s35ZqGtYqVPPyKiu5rkUhP6nfkWfWiFNhaDjcnY1uwYzho4yZAMAygPwQuawutZDtRrrcgWUZ"
const contrato = "KT1EFLadgpu6EjSh4qrQP1BsxGyjP3cHh6cu"
const Tezos = new TezosToolkit("https://ghostnet.ecadinfra.com")
Tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(private_key) });

app.get('/auction', async (req, res) => {
  try {
    const contract = await Tezos.wallet.at(contrato)
    const op = contract.methods.finalize_auction(1, 5, 1).send();
    res.status(200).json({ message: `Transação aceita ${op}` });
      } catch (error) {
        console.error('Error', error)
        res.status(500).json({ error: 'An error occurred'})
      }
    });

    app.post('/auction', async (req, res) => {
      try {
        const contract = await Tezos.wallet.at(contrato)
        const op = contract.methods.finalize_auction(2, 5, 2).send();
        res.status(200).json({ message: `Transação aceita ${op}` });
          } catch (error) {
            console.error('Error', error)
            res.status(500).json({ error: 'An error occurred'})
          }
        });
// Iniciando o servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
