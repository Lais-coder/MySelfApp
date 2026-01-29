# Backend MySelfApp

Este servidor Express recebe os envios do questionário e armazena em um banco SQLite.

Variáveis de ambiente (veja `.env.example`):

- `PORT` - porta do servidor (padrão 4000)
- `DB_PATH` - caminho do arquivo sqlite
- `UPLOAD_DIR` - pasta onde arquivos são salvos

Instalação e execução (no diretório `/server`):

```bash
npm install
npm run dev   # usa nodemon
# ou
npm start
```

Endpoints:

- `POST /api/questionnaire` - recebe `multipart/form-data` com um campo `payload` (JSON) e arquivos como `file_<campo>`.
- `GET /api/questionnaire` - lista envios salvos.

- `POST /api/login` - rota de login simples que espera `{ username, password }` e valida contra o banco.

Armazenamento:

A tabela `submissions` contém `id`, `name`, `email`, `data` (JSON com todos os campos), `files` (JSON com metadados dos arquivos) e `created_at`.

Observações:

- O frontend deve enviar a variável de ambiente `VITE_API_URL` apontando para `http://localhost:4000` (ou outra porta) para que os dados sejam enviados para este backend.
