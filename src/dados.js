import { randomUUID } from 'crypto';

export const growdevers = [
    {
        id: randomUUID(),
        nome: "Daphne",
        email: "daphne@dog.com",
        idade: 20,
        matriculado: true
    },

    {
        id: randomUUID(),
        nome: "João",
        email: "joao@gmail.com",
        idade: 30,
        matriculado: false
    }
]