describe('Desafio ACCENTURE DemoQA - Book Store API', () => {

    let userId
    let token
    let username
    let password
    let isbnLivro1
    let isbnLivro2

    before(() => {


        // DADOS DO USUÁRIO
        

        username = `guilherme_${Date.now()}`
        password = 'Teste@123456'


        // 1ª Etapa - CRIAR UM USUÁRIO
        // POST /Account/v1/User
        

        cy.request({
            method: 'POST',
            url: '/Account/v1/User',
            body: {
                userName: username,
                password: password
            }
        }).then((response) => {

            expect(response.status).to.eq(201)

            expect(response.body).to.have.property('userID')
            expect(response.body.username).to.eq(username)

            userId = response.body.userID

            cy.log(`Usuário criado com sucesso!: ${username}`)
            cy.log(`User ID: ${userId}`)
        })


        // 2ª Etapa - GERAR TOKEN DE ACESSO
        // POST /Account/v1/GenerateToken
    

        cy.request({
            method: 'POST',
            url: '/Account/v1/GenerateToken',
            body: {
                userName: username,
                password: password
            }
        }).then((response) => {

            expect(response.status).to.eq(200)

            expect(response.body).to.have.property('token')

            token = response.body.token

            cy.log('Token gerado com sucesso!')
        })


        
        // 3ª Etapa - CONFIRMAR SE O USUÁRIO ESTÁ AUTORIZADO
        // POST /Account/v1/Authorized
    

        cy.request({
            method: 'POST',
            url: '/Account/v1/Authorized',
            body: {
                userName: username,
                password: password
            }
        }).then((response) => {

            expect(response.status).to.eq(200)

            expect(response.body).to.eq(true)

            cy.log('Usuário autorizado com sucesso!')
        })


        
        // 4ª Etapa - LISTAR OS LIVROS DISPONÍVEIS
        // GET /BookStore/v1/Books
        

        cy.request({
            method: 'GET',
            url: '/BookStore/v1/Books'
        }).then((response) => {

            expect(response.status).to.eq(200)

            expect(response.body).to.have.property('books')

            expect(response.body.books)
                .to.be.an('array')
                .and.to.have.length.greaterThan(1)

            // Escolha dos livros
            isbnLivro1 = response.body.books[0].isbn
            isbnLivro2 = response.body.books[1].isbn

            cy.log(`Livro 1: ${isbnLivro1}`)
            cy.log(`Livro 2: ${isbnLivro2}`)
        })


        
        // 5ª Etapa - ALUGAR DOIS LIVROS
        // POST /BookStore/v1/Books
        

        cy.request({
            method: 'POST',
            url: '/BookStore/v1/Books',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                userId: userId,
                collectionOfIsbns: [
                    {
                        isbn: isbnLivro1
                    },
                    {
                        isbn: isbnLivro2
                    }
                ]
            }
        }).then((response) => {

            expect(response.status).to.eq(201)

            cy.log('Seus livros foram alugados com sucesso!')
        })


        
        // 6ª Etapa - LISTAR DETALHES DO USUÁRIO
        // GET /Account/v1/User/{userID}
        

        cy.request({
            method: 'GET',
            url: `/Account/v1/User/${userId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {

            expect(response.status).to.eq(200)

            // Valida usuário
            expect(response.body.userId).to.eq(userId)

            expect(response.body.username).to.eq(username)

            // Valida livros
            expect(response.body.books)
                .to.be.an('array')
                .and.to.have.length(2)

            // Verifica se o primeiro livro foi alugado
            expect(
                response.body.books.some(
                    (book) => book.isbn === isbnLivro1
                )
            ).to.be.true

            // Verifica se o segundo livro foi alugado
            expect(
                response.body.books.some(
                    (book) => book.isbn === isbnLivro2
                )
            ).to.be.true

            cy.log('Usuário e livros validados com sucesso')
        })
    })


    
    // TESTE PRINCIPAL
    

    it('Deve executar todo o fluxo de criação e aluguel de livros', () => {

        expect(userId).to.not.be.undefined
        expect(token).to.not.be.undefined
        expect(isbnLivro1).to.not.be.undefined
        expect(isbnLivro2).to.not.be.undefined

    })

})