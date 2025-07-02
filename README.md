# Leirisonda Static Server

Static file server for Leirisonda PWA (Progressive Web Application).

## 📋 Descrição

Este projeto serve como servidor estático para a aplicação PWA Leirisonda, utilizando o pacote `serve` para hospedar os arquivos compilados.

## 🚀 Como usar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

### Preview

```bash
npm run preview
```

O servidor será iniciado na porta 5173 por padrão.

## 📁 Estrutura do projeto

```
leirisonda-static-server/
├── leirisonda-deploy/     # Arquivos estáticos da aplicação
│   ├── assets/           # CSS, JS e outros recursos
│   ├── index.html        # Página principal
│   ├── manifest.json     # Manifesto PWA
│   └── ...              # Outros arquivos estáticos
├── package.json          # Configurações do projeto
└── README.md            # Este arquivo
```

## 🛠️ Tecnologias utilizadas

- **Node.js**: Runtime JavaScript
- **serve**: Servidor estático simples e rápido

## 📱 PWA Features

A aplicação inclui:

- Manifesto PWA configurado
- Service Worker para funcionamento offline
- Ícones otimizados para diferentes dispositivos

## 🔧 Scripts disponíveis

- `npm run dev`: Inicia o servidor em modo desenvolvimento
- `npm start`: Inicia o servidor em modo produção
- `npm run preview`: Inicia o servidor em modo preview

## 📄 Licença

Este projeto é propriedade privada.
