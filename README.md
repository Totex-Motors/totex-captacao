# Totex Captação - Next.js

Plataforma de captação automotiva Totex adaptada para **Next.js** 15.

## 🚀 Início Rápido

### Instalação

O projeto foi adaptado e as dependências já foram instaladas. Caso você clone em outro lugar:

```bash
npm install
```

### Executar em Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em: **http://localhost:3000**

### Build para Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
app/
├── layout.tsx                 # Layout raiz
├── page.tsx                   # Página inicial (Home)
├── globals.css               # Estilos globais
├── components/               # Componentes
│   ├── ui/                  # Componentes de UI (shadcn)
│   └── figma/               # Componentes customizados
├── formulario/
│   └── page.tsx             # Formulário do veículo
├── dados-pessoais/
│   └── page.tsx             # Dados pessoais
├── agendamento/
│   └── page.tsx             # Agendamento
└── confirmacao/
    └── page.tsx             # Confirmação
public/
└── imports/                  # Imagens estáticas
```

## 🛠 Stack Técnico

- **Framework**: Next.js 15
- **React**: 19
- **TypeScript**: ✅
- **Styling**: Tailwind CSS 3
- **Animações**: Motion (Framer Motion)
- **Ícones**: Lucide React
- **UI Components**: shadcn/ui
- **Formato Data**: date-fns

## 📦 Principais Dependências

```json
{
  "react": "^19.0.0-rc",
  "react-dom": "^19.0.0-rc",
  "next": "^15.1.0",
  "motion": "^11.1.1",
  "lucide-react": "^0.408.0",
  "tailwindcss": "^3.4.1",
  "date-fns": "^2.30.0"
}
```

## 📄 Rotas Disponíveis

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial |
| `/formulario` | Dados do veículo |
| `/dados-pessoais` | Informações pessoais |
| `/agendamento` | Agendar visita |
| `/confirmacao` | Confirmação do agendamento |

## ✨ Alterações do React Router → Next.js

### Antes (React Router)
```typescript
import { useNavigate } from "react-router";

const navigate = useNavigate();
navigate("/formulario");
```

### Depois (Next.js)
```typescript
"use client";
import { useRouter } from "next/navigation";

const router = useRouter();
router.push("/formulario");
```

## 🎨 Customização

### Tailwind CSS
Edite `tailwind.config.ts` para customizar cores e temas.

### Componentes
Os componentes de UI estão em `app/components/ui/` e podem ser customizados conforme necessário.

### Imagens
Todas as imagens estão em `public/imports/` e podem ser acessadas com `/imports/nome-imagem.png`

## 📱 Desenvolvimento Responsivo

O projeto é totalmente responsivo e mobile-first, com suporte para:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🐛 Troubleshooting

### Porta 3000 em uso
```bash
npm run dev -- -p 3001
```

### Limpar cache Next.js
```bash
rm -r .next
npm run dev
```

### Reinstalar dependências
```bash
rm -r node_modules
npm install
```

## 📝 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto se necessário:

```env
# Adicione suas variáveis aqui
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Docker

Crie um `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📞 Suporte

Para dúvidas ou problemas, verifique:
- [Documentação Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

**Projeto adaptado para Next.js em Abril 2026** ✨
