A API possui as seguintes rotas:

- **POST** `/recommendations`
    
    Adiciona uma nova recomendação de música. A requisição tem o seguinte formato:
    
    ```json
    {
    	"name": "Falamansa - Xote dos Milagres",
    	"youtubeLink": "[https://www.youtube.com/watch?v=chwyjJbcs1Y](https://www.youtube.com/watch?v=chwyjJbcs1Y&ab_channel=Deck)"
    }
    ```
    
    - Validação
        - `name` é uma string obrigatória
        - `youtubeLink` deve ser um link do youtube
- **POST** `/recommendations/:id/upvote`
    
    Adiciona um ponto à pontuação da recomendação. Não espera nada no corpo.
    
- **POST** `/recommendations/:id/downvote`
    - Remove um ponto da pontuação da recomendação. Não espera nada no corpo.
    - Se a pontuação fica abaixo de -5, a recomendação deve ser excluída.
- **GET** `/recommendations`
    
    Pega todas as últimas 10 recomendações.
    
    A resposta tem o formato:
    
    ```jsx
    [
    	{
    		"id": 1,
    		"name": "Chitãozinho E Xororó - Evidências",
    		"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    		"score": 245
    	}
    ]
    ```
    
- **GET** `/recommendations/:id`
    
    Pega uma recomendação pelo seu ID.
    
    A resposta tem o formato:
    
    ```jsx
    {
    	"id": 1,
    	"name": "Chitãozinho E Xororó - Evidências",
    	"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    	"score": 245
    },
    ```
    
- **GET** `/recommendations/random`
    
    Pega uma recomendação aleatória, baseada na seguinte lógica:
    
    - **70% das vezes que baterem nessa rota**: uma música com pontuação maior que 10 deve ser recomendada aleatoriamente.
    - **30% das vezes que baterem nessa rota**: uma música com pontuação entre -5 e 10 (inclusive), deve ser recomendada aleatoriamente.
    - Caso só haja músicas com pontuação acima de 10 ou somente abaixo/igual a 10, 100% das vezes deve ser sorteada qualquer música.
    - Caso não haja nenhuma música cadastrada, deve ser retornado status 404.
    
    A resposta tem o formato:
    
    ```jsx
    {
    	"id": 1,
    	"name": "Chitãozinho E Xororó - Evidências",
    	"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    	"score": 245
    },
    ```
    
- **GET** `/recommendations/top/:amount`
    
    Lista as músicas com maior número de pontos e sua pontuação. São retornadas as top x músicas (parâmetro `:amount` da rota), ordenadas por pontuação (maiores primeiro)
    
    ```json
    [
    	{
    		"id": 150,
    		"name": "Chitãozinho E Xororó - Evidências",
    		"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    		"score": 245
    	},
    	{
    		"id": 12,
    		"name": "Falamansa - Xote dos Milagres",
    		"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    		"score": 112
    	},
    	...
    ]
    ```
