# 📋 Guia de Integração - Agendamentos

## 🏗️ Arquitetura Atual

### Cache FIPE
- **Local**: `app/lib/fipe-cache.ts`
- **TTL**: 24 horas
- **Requisições**: 1 por totem por dia (máx 500/dia aceito)
- **Distribuído**: Cada totem tem seu próprio cache local

### Unidades
- **Arquivo**: `app/config/unidades.ts`
- **Status**: Hardcoded (pronto para API)
- **Fácil troca**: Adicione uma função `getUnidades()` que chama a API quando estiver pronto

### Agendamentos
- **Arquivo**: `data/agendamentos.json` (criado automaticamente)
- **Endpoint**: `POST /api/agendamento`
- **Validações**: Email, telefone, data, horário
- **Retorno**: ID único + status confirmado

---

## 🔌 Como Integrar com Seu Site Externo

### 1️⃣ Unidades (quando tiver a API)

**Antes** (atual):
```typescript
// app/config/unidades.ts
export const UNIDADES: Unidade[] = [
  { id: "1", nome: "Tamboré", endereco: "..." }
];
```

**Depois** (quando tiver a API):
```typescript
// app/config/unidades.ts - Modifique a função getUnidades()
export async function getUnidades(): Promise<Unidade[]> {
  const response = await fetch('https://seu-site.com/api/unidades');
  return await response.json();
}
```

**No componente** (já está pronto):
```typescript
import { getUnidades } from "@/app/config/unidades";
const unidades = await getUnidades(); // Vai buscar da API automaticamente
```

---

### 2️⃣ Agendamentos (quando tiver a API)

**Atual** (salva em arquivo JSON):
```
POST /api/agendamento
{
  "nome": "Maria Oliveira",
  "email": "maria@email.com",
  "telefone": "(11) 98888-7777",
  "marca": "Honda",
  "modelo": "Civic",
  "versao": "EXL 2.0 Automático",
  "km": 50000,
  "placa": "ABC-1234",
  "cor": "Preto",
  "observacoes": "...",
  "localVistoria": "Totex Motors - Tamboré",
  "dataVistoria": "2026-04-15",
  "horarioVistoria": "10:00"
}
```

**Response**:
```json
{
  "sucesso": true,
  "agendamentoId": "AGD-1713176400000-abc12def3",
  "dados": {
    "id": "AGD-1713176400000-abc12def3",
    "dataCriacao": "2026-04-15T10:30:00.000Z",
    "status": "confirmado",
    ...
  }
}
```

---

## 📝 Próximas Integrations

### Quando tiver a URL do site externo:

1. **Diga-nos a URL e o formato da API**
   - Ex: `https://seu-marketplace.com/api/agendamentos`

2. **Nós trocamos** `app/api/agendamento/route.ts`:
   ```typescript
   // Ao invés de salvar em arquivo, envia para sua API:
   const response = await fetch('https://seu-site.com/api/agendamentos', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(payload),
   });
   ```

3. **Pronto!** Os agendamentos já vão direto para o seu banco de dados

---

## 🧪 Testando Agendamentos

### Ver todos os agendamentos salvos:
```
GET /api/agendamento
```

Retorna JSON com todos os agendamentos salvos em `data/agendamentos.json`

### Arquivo de Agendamentos
```
data/agendamentos.json
[
  {
    "id": "AGD-...",
    "nome": "Maria Oliveira",
    "email": "maria@email.com",
    ...
    "dataCriacao": "2026-04-15T10:30:00.000Z",
    "status": "confirmado"
  }
]
```

---

## ⚙️ Variáveis de Ambiente (tipo)

Quando for integrar com o site externo, adicione no `.env.local`:
```
NEXT_PUBLIC_API_URL=https://seu-site.com
API_SECRET_KEY=sua-chave-secreta
```

E use no endpoint:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## 🎯 Resumo

| Componente | Status | Arquivo | Fácil? |
|-----------|--------|---------|--------|
| Cache FIPE | ✅ Pronto | `app/lib/fipe-cache.ts` | Não precisa mexer |
| Unidades | 🔄 Hardcoded | `app/config/unidades.ts` | ✅ Sim, trocar função |
| Agendamentos | 🔄 Local JSON | `app/api/agendamento/route.ts` | ✅ Sim, trocar endpoint |

Avisa quando o site externo estiver pronto que é rapidinho! 🚀
