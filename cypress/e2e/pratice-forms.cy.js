describe('Desafio accenture - Practice Form', () => {

    it('Deve preencher e enviar o formulário com sucesso', () => {

        // 1 - ACESSAR O SITE

        cy.visit('/')


        // 2 - ACESSAR FORMS

        cy.contains('Forms')
            .should('be.visible')
            .click()


        // 3 - ACESSAR PRACTICE FORM

        cy.contains('Practice Form')
            .should('be.visible')
            .click()


        // 4 - DADOS ALEATÓRIOS

        const numeroAleatorio = Math.floor(Math.random() * 100000)

        const nome = `Guilherme${numeroAleatorio}`
        const sobrenome = `Teste${numeroAleatorio}`
        const email = `guilherme${numeroAleatorio}@example.com`
        const telefone = `8199${Math.floor(1000000 + Math.random() * 9000000)}`

        // 5 - PREENCHER FIRST NAME

        cy.get('#firstName')
            .should('be.visible')
            .type(nome)


        // 6 - PREENCHER LAST NAME

        cy.get('#lastName')
            .should('be.visible')
            .type(sobrenome)


        // 7 - PREENCHER EMAIL

        cy.get('#userEmail')
            .should('be.visible')
            .type(email)


        // 8 - SELECIONAR GENDER

        cy.get('label[for="gender-radio-1"]')
            .should('be.visible')
            .click()


        // 9 - PREENCHER MOBILE

        cy.get('#userNumber')
            .should('be.visible')
            .type(telefone)


        // 10 - DATA DE NASCIMENTO
        cy.get('#dateOfBirthInput')
            .should('be.visible')
            .click()

        cy.get('.react-datepicker__day--001')
            .not('.react-datepicker__day--outside-month')
            .click()

        cy.get('#subjectsInput')
            .should('be.visible')
            .click()
            .type('Maths')
            .type('{enter}')


        // 11 - SUBJECTS
        cy.get('#subjectsInput')
            .should('be.visible')
            .click()
            .type('Maths')
            .type('{enter}')


        // 12 - HOBBIES

        cy.get('#hobbies-checkbox-1')
            .check({ force: true })

        // 13 - UPLOAD DO ARQUIVO

        cy.get('#uploadPicture')
            .selectFile('cypress/files/arq.txt', { force: true })


        // 14 - CURRENT ADDRESS

        cy.get('#currentAddress')
            .should('exist')
            .type('Rua de Teste, 123 - Recife - PE', { force: true })


        // 15 - STATE

        cy.get('#state')
            .click({ force: true })

        cy.get('#state input')
            .type('NCR', { force: true })
            .type('{enter}', { force: true })


        // 16 - CITY

        cy.get('#city')
            .click({ force: true })

        cy.get('#city input')
            .type('Delhi', { force: true })
            .type('{enter}', { force: true })


        // 17 - SUBMIT

        cy.get('#submit')
            .scrollIntoView()
            .click({ force: true })

        // 18 - VALIDAR POPUP

        cy.get('.modal-content')
            .should('be.visible')

        cy.get('.modal-title')
            .should('be.visible')
            .and('contain', 'Thanks for submitting the form')


        // 19 - VALIDAR DADOS DO POPUP

        cy.get('.table-responsive')
            .should('be.visible')
            .and('contain', nome)
            .and('contain', sobrenome)
            .and('contain', email)


        // 20 - FECHAR POPUP

        cy.get('#closeLargeModal')
            .should('be.visible')
            .click({ force: true })

        // 21 - GARANTIR QUE O POPUP FOI FECHADO

        //cy.get('.modal.show')
            //.should('not.exist')

    })

})