describe('Desafio ACCENTURE DemoQA - Book Store API', () => {

    let userId
    let token
    let username
    let password
    let isbnLivro1
    let isbnLivro2


    before(() => {

        // DADOS DO USUÁRIO

        username = `guilherme_test1${Date.now()}`
        password = 'Teste@123456'


        // 1ª ETAPA - CRIAR USUÁRIO
        // POST /Account/v1/User

        return cy.request({
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

            cy.log(`Usuário criado com sucesso: ${username}`)
            cy.log(`User ID: ${userId}`)


            // 2ª ETAPA - GERAR TOKEN
            // POST /Account/v1/GenerateToken

            return cy.request({
                method: 'POST',
                url: '/Account/v1/GenerateToken',

                body: {
                    userName: username,
                    password: password
                }

            })

        }).then((response) => {

            expect(response.status).to.eq(200)

            expect(response.body).to.have.property('token')

            token = response.body.token

            cy.log('Token gerado com sucesso!')
            cy.log(`Token: ${token}`)


            // 3ª ETAPA - CONFIRMAR AUTORIZAÇÃO
            // POST /Account/v1/Authorized

            return cy.request({
                method: 'POST',
                url: '/Account/v1/Authorized',

                body: {
                    userName: username,
                    password: password
                }

            })

        }).then((response) => {

            expect(response.status).to.eq(200)
            expect(response.body).to.eq(true)

            cy.log('Usuário autorizado com sucesso!')


            // 4ª ETAPA - LISTAR LIVROS
            // GET /BookStore/v1/Books

            return cy.request({
                method: 'GET',
                url: '/BookStore/v1/Books'
            })

        }).then((response) => {

            expect(response.status).to.eq(200)

            expect(response.body).to.have.property('books')

            expect(response.body.books)
                .to.be.an('array')
                .and.to.have.length.greaterThan(1)


            // Seleciona os dois primeiros livros
            isbnLivro1 = response.body.books[0].isbn
            isbnLivro2 = response.body.books[1].isbn

            cy.log(`Livro 1: ${isbnLivro1}`)
            cy.log(`Livro 2: ${isbnLivro2}`)


            // VERIFICAÇÃO ANTES DO POST

            expect(userId).to.not.be.undefined
            expect(token).to.not.be.undefined
            expect(isbnLivro1).to.not.be.undefined
            expect(isbnLivro2).to.not.be.undefined


            // 5ª ETAPA - ALUGAR DOIS LIVROS
            // POST /BookStore/v1/Books

            return cy.request({
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

            })

        }).then((response) => {

            expect(response.status).to.eq(201)

            cy.log('Seus livros foram alugados com sucesso!')


            // 6ª ETAPA - LISTAR DETALHES DO USUÁRIO
            // GET /Account/v1/User/{userID}

            return cy.request({
                method: 'GET',
                url: `/Account/v1/User/${userId}`,

                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

        }).then((response) => {

            expect(response.status).to.eq(200)


            // VALIDA USUÁRIO

            expect(response.body.userId).to.eq(userId)

            expect(response.body.username).to.eq(username)


            // VALIDA LIVROS

            expect(response.body.books)
                .to.be.an('array')
                .and.to.have.length(2)


            // Verifica primeiro livro
            expect(
                response.body.books.some(
                    (book) => book.isbn === isbnLivro1
                )
            ).to.be.true


            // Verifica segundo livro
            expect(
                response.body.books.some(
                    (book) => book.isbn === isbnLivro2
                )
            ).to.be.true


            cy.log('Usuário e livros validados com sucesso!')

        })

    })



    it('Deve executar todo o fluxo de criação e aluguel de livros', () => {

        expect(userId).to.not.be.undefined
        expect(token).to.not.be.undefined
        expect(isbnLivro1).to.not.be.undefined
        expect(isbnLivro2).to.not.be.undefined

    })

})