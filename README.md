# 🦁 ZooManager — Sistema de Gestão de Zoológico

Repositório criado para o **Desafio Técnico de Estágio Dev**, apresentando o projeto **ZooManager**, um sistema web completo para o gerenciamento de animais e cuidados veterinários de um zoológico.

O objetivo deste projeto é demonstrar competências em desenvolvimento **Full Stack**, integrando uma API robusta em **.NET 9** com uma interface moderna em **React**, aplicando boas práticas de arquitetura, segurança e modelagem de dados.

## 📚 Sobre o Repositório

Este repositório contém a solução completa do desafio, dividida em:
* 🧩 **ZooManagerApi:** O Back-end desenvolvido em .NET Core, responsável pela lógica de negócios, autenticação e acesso a dados.
* 💻 **zoo-web:** O Front-end desenvolvido em React + Vite, oferecendo uma interface interativa e responsiva para os guardiões do zoológico.

O projeto busca aplicar na prática conceitos avançados como **Autenticação JWT**, **Entity Framework Core (Code First)** e **Arquitetura em Camadas**.

## 🧰 Tecnologias Utilizadas

| Categoria | Ferramentas / Linguagens |
| :--- | :--- |
| **Front-end** | React (Vite), JavaScript, CSS Modules, Axios |
| **Back-end** | C# .NET 9.0, ASP.NET Core Web API |
| **Banco de Dados** | SQL Server, Entity Framework Core |
| **Autenticação** | JWT (JSON Web Token), BCrypt (Hash de Senha) |
| **Ferramentas** | Swagger UI, Visual Studio / VS Code, Git |

### 📂 Estrutura do Projeto
* `ZooManagerApi/` → API RESTful com Controllers, Services, Repositories e DTOs.
* `zoo-web/` → Aplicação React com Rotas, Contexto de Autenticação e Componentes.

## 💡 Projeto Final — Funcionalidades

O **ZooManager** permite que usuários ("Guardiões") se cadastrem e gerenciem o catálogo da selva.

**Principais características:**
* 🔐 **Sistema de Autenticação Completo:** Login e Registro com criptografia de senha e proteção de rotas (só usuários logados acessam o sistema).
* 🦁 **Gestão de Animais:** CRUD completo (Criar, Ler, Atualizar, Deletar) com relacionamento de Espécies e Habitats.
* 🏥 **Controle de Cuidados:** Registro de tratamentos e vacinas vinculados a cada animal.
* 🎨 **UX Aprimorada:** Uso de Modais para formulários e confirmações, filtros de busca em tempo real e feedback visual de erros.
* 🛡️ **Segurança:** Proteção contra SQL Injection via EF Core e validação de dados no Back-end e Front-end.

---

## 🚀 Jornada de Desenvolvimento e Desafios

Este projeto foi construído em etapas, superando desafios técnicos específicos em cada fase. Abaixo, o relato da evolução do código:

### ⏳ Fase 1: Arquitetura e Backend
A primeira decisão foi não fazer tudo nos *Controllers*. Optei por uma **Arquitetura em Camadas** (`Repository` para banco, `Service` para regras, `Controller` para HTTP), o que deixou o código mais limpo e testável.
* *Desafio:* Modelar o banco usando **Entity Framework (Code First)**. Ver o código C# se transformar automaticamente em tabelas SQL relacionais foi um ponto alto de produtividade.

### ⏳ Fase 2: Integração Front-End
A conexão entre o React (Vite) e a API .NET exigiu configuração cuidadosa de **CORS** e a criação de um serviço de API centralizado (`api.js`) para gerenciar as requisições.

### ⏳ Fase 3: A Saga da Autenticação (O Maior Desafio)
A implementação da segurança foi o ponto mais complexo.
* **O Dilema:** Inicialmente usei Cookies HttpOnly, mas enfrentei dificuldades com o ciclo de vida da sessão.
* **A Solução:** Decidi migrar para o armazenamento do Token no `sessionStorage`.
* **O Resultado:** Isso garantiu um requisito de segurança específico que eu desejava: **"Fechou a aba = Deslogou"**. Diferente do `localStorage` ou Cookies persistentes, essa abordagem protege o sistema caso o usuário esqueça de clicar em "Sair" em um computador público.

### ⏳ Fase 4: Refinamento de Dados
Durante os testes, enfrentei um erro **400 Bad Request** persistente ao tentar cadastrar animais.
* *O Bug:* O React enviava os IDs dos selects como "strings" (ex: `"2"`), mas o C# esperava inteiros estritos.
* *A Correção:* Implementei conversões explícitas (`parseInt`) no Front-end e fortifiquei os DTOs no Back-end para validar os tipos corretamente.

### ⏳ Fase 5: Polimento e UX
Para finalizar, substituí os alertas nativos do navegador (`window.alert`) por **Modais Customizados** e mensagens de erro inline nos formulários, proporcionando uma experiência muito mais profissional e fluida para o usuário.

---

_Desenvolvido por Arthur de Oliveira
