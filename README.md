# PHC Radio

<div align="center">

<img src="https://stream-tools.zenomedia.com/content/stations/cc52c0e6-7e0b-4ec6-8d26-e680c6b03307/image/?keep=w&lu=1768088125000&resize=350x350" alt="PHC Radio Banner" style="border-radius:30px;width:200px;height:200px" />

**Uma aplicação web moderna para streaming de rádio com metadados em tempo real**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=yellow)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=blue)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Demo ao Vivo](https://phcradio.vercel.app/) · [Reportar Bug](https://github.com/PHCavalcante/PHC-Radio/issues/new)

</div>

---

## Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Principais Recursos](#-principais-recursos)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Licença](#-licença)

---

## Sobre o Projeto

**PHC Radio** é uma aplicação web moderna e responsiva para streaming de rádio online, oferecendo uma experiência de áudio imersiva com metadados em tempo real. Construída com as mais recentes tecnologias web, a aplicação fornece informações sobre as músicas tocadas, histórico de reprodução e integração com serviços de música populares, servindo também como um exemplo de front-end para streams de áudio, como [Zeno.fm](https://zeno.fm/) e semelhantes.

### Por que PHC Radio?

- **Interface Moderna**: Design limpo e intuitivo otimizado para desktop e mobile
- **Metadados em Tempo Real**: Informações atualizadas sobre a música atual via Server-Sent Events (SSE)
- **Capas de Álbuns**: Busca automática de artwork usando a iTunes Search API
- **Histórico de Reprodução**: Acompanhe as últimas faixas tocadas
- **Visualizador de Áudio**: Animação de ondas sonoras em tempo real
- **Integração Spotify**: Gostou de uma música e quer ouvi-la novamente? Basta ir no histórico e clicar no ícone do spotify ao lado da música escolhida

---

## Principais Recursos

<table>
<tr>
<td width="50%">

### Player de Áudio Avançado
- Controles Play/Pause intuitivos
- Ajuste de volume com slider
- Visualizador de ondas sonoras em tempo real
- Suporte a streaming de alta qualidade

</td>
<td width="50%">

### Metadados em Tempo Real
- Conexão via SSE (Server-Sent Events)
- Parsing automático de artista e música
- Atualização instantânea da interface

</td>
</tr>
<tr>
<td width="50%">

### Interface Dinâmica
- Design responsivo e moderno
- Capas de álbum em alta resolução
- Animações suaves e feedback visual

</td>
<td width="50%">

### Histórico de Faixas
- Exibição de músicas reproduzidas
- Links diretos para Spotify

</td>
</tr>
</table>

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (incluído com Node.js) ou **pnpm** / **yarn**

---

## Instalação

Siga estes passos para configurar o projeto localmente:

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/PHCavalcante/PHC-Radio.git
cd PHC-Radio
```

### 2️⃣ Instale as Dependências

Escolha seu gerenciador de pacotes preferido:

```bash
# usando npm
npm install

# usando pnpm
pnpm install

# usando yarn
yarn install
```
Caso você tenha sua propria estação, você pode integrar ao front-end. Para isso, siga para a etapa três
### 3️⃣ Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# URL do stream de áudio
VITE_STREAM_URL=https://stream.zeno.fm/seu-ponto-de-montagem

# Endpoint SSE para metadados em tempo real
VITE_METADATA_URL=https://stream.zeno.fm/mounts/metadata/subscribe/seu-ponto-de-montagem
```

---

## Uso

### Ambiente de Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

---

## Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

Feito com ❤️ por [PHCavalcante](https://github.com/PHCavalcante)

[⬆ Voltar ao topo](#phc-radio)

</div>