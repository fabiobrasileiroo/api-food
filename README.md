# Restaurante API React Native

Esta é uma API RESTful para gerenciar restaurantes e alimentos, desenvolvida com Node.js e SQLite. Ela oferece endpoints para listar, adicionar e deletar restaurantes e alimentos, e inclui documentação interativa usando Swagger.

## Tabelas

A API é composta por duas tabelas principais:
- `restaurants`: Contém informações sobre os restaurantes.
- `foods`: Contém informações sobre os alimentos disponíveis nos restaurantes.

## Endpoints

### Restaurantes

- **Listar Restaurantes**
  - **URL:** `/restaurants`
  - **Método:** `GET`
  - **Resposta:** Lista todos os restaurantes.
  - **Exemplo de Resposta:**
    ```json
    {
      "restaurants": [
        {
          "id": "1",
          "name": "KFC",
          "image": "https://i.imgur.com/sZ1Jye3.png"
        },
        // outros restaurantes
      ]
    }
    ```

- **Adicionar Restaurante**
  - **URL:** `/restaurants`
  - **Método:** `POST`
  - **Corpo da Requisição:**
    ```json
    {
      "id": "7",
      "name": "Novo Restaurante",
      "image": "https://i.imgur.com/novo.png"
    }
    ```
  - **Resposta:** Restaurante adicionado com sucesso.
  - **Código de Resposta:** `201 Created`

- **Deletar Restaurante**
  - **URL:** `/restaurants/{id}`
  - **Método:** `DELETE`
  - **Parâmetros:**
    - `id`: ID do restaurante a ser deletado.
  - **Resposta:** Restaurante deletado com sucesso.
  - **Código de Resposta:** `204 No Content`

### Alimentos

- **Listar Alimentos**
  - **URL:** `/foods`
  - **Método:** `GET`
  - **Resposta:** Lista todos os alimentos.
  - **Exemplo de Resposta:**
    ```json
    {
      "foods": [
        {
          "id": "1",
          "name": "Frango assado",
          "price": 39.90,
          "time": "50-60 min",
          "delivery": 5.99,
          "rating": 4.8,
          "image": "https://i.imgur.com/CEVUdju.png",
          "restaurantId": "1"
        },
        // outros alimentos
      ]
    }
    ```

- **Adicionar Alimento**
  - **URL:** `/foods`
  - **Método:** `POST`
  - **Corpo da Requisição:**
    ```json
    {
      "id": "6",
      "name": "Novo Alimento",
      "price": 25.00,
      "time": "20-30 min",
      "delivery": 3.99,
      "rating": 4.7,
      "image": "https://i.imgur.com/novo.png",
      "restaurantId": "2"
    }
    ```
  - **Resposta:** Alimento adicionado com sucesso.
  - **Código de Resposta:** `201 Created`

- **Deletar Alimento**
  - **URL:** `/foods/{id}`
  - **Método:** `DELETE`
  - **Parâmetros:**
    - `id`: ID do alimento a ser deletado.
  - **Resposta:** Alimento deletado com sucesso.
  - **Código de Resposta:** `204 No Content`

## Configuração

### Pré-requisitos

- Node.js (v12 ou superior)
- npm

### Instalação

1. Clone o repositório:
   ``` bash
   git clone <URL_DO_REPOSITORIO>
   cd <DIRETORIO_DO_REPOSITORIO>
  

2. Instale as dependências:

``` bash
npm install
```

Execute o servidor:
``` bash
    npm start
```

### Acesse a documentação Swagger em http://localhost:3000/api-docs.

Contribuição

Se você quiser contribuir para este projeto, sinta-se à vontade para fazer um fork e enviar pull requests. Para questões e sugestões, por favor, abra um issue no repositório.

## Desenvolvido por Fábio Brasileiro.


Este README inclui:
- **Descrição** da API e suas funcionalidades.
- **Endpoints** disponíveis com exemplos de requisições e respostas.
- **Instruções de configuração** e execução.
- **Informações sobre contribuição** e licença.

Você pode ajustar conforme necessário para se adequar ao seu projeto.
