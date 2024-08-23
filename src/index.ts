import express, { Request, Response } from "express"
import cors from "cors"
import { User, UserDB } from "./types";
import { db } from "./database/knex";

import { UserDatabase } from "./database/UserDatabase";


const app = express()
app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("servidor rodando na porta 3003, http://localhost:3003")
})

//endpoint de teste
app.get("/ping", (req: Request, res: Response) => {
    try {
        res.status(200).send("Pong!")

    } catch (error: any) {
        console.log(error)

        // se chegar ainda valendo 200 sabemos que foi um erro inesperado
        if (res.statusCode === 200) {
            res.status(500) // definimos 500 porque é algo que o servidor não previu
        }

        res.send(error.message)
    }
})
// =============================***============================


app.get("/users", async (req: Request, res: Response) => {
    try {
        
        // const result = await db("users")
        const userDatabase = new UserDatabase()
        const result = await userDatabase.getUsers()


        res.status(200).send(result)
        if (!result) {
            res.status(404)
            throw new Error("O recurso solicitado não foi encontrado")
        }

    } catch (error) {
        console.log(error)

        // se chegar ainda valendo 200 sabemos que foi um erro inesperado
        if (res.statusCode === 200) {
            res.status(500) // definimos 500 porque é algo que o servidor não previu
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


app.post("/users", async (req: Request, res: Response) => {
    try {
        const { id, name, age, firstSemesterGrade, secondSemesterGrade, teacherName, roomNumber } = req.body

        if (typeof id !== "string") {
            res.statusCode = 400
            throw new Error("id precisa ser uma string")
        }
        if (typeof name !== "string") {
            res.statusCode = 400
            throw new Error("Nome precisa ser uma string")
        }
        if (typeof age !== "string") {
            res.statusCode = 400
            throw new Error("Email precisa ser uma string")
        }
        if (typeof firstSemesterGrade !== "string") {
            res.statusCode = 400
            throw new Error("Password precisa ser uma string")
        }
        if (typeof secondSemesterGrade !== "string") {
            res.statusCode = 400
            throw new Error("Password precisa ser uma string")
        }
        if (typeof teacherName !== "string") {
            res.statusCode = 400
            throw new Error("Password precisa ser uma string")
        }
        if (typeof roomNumber !== "string") {
            res.statusCode = 400
            throw new Error("Password precisa ser uma string")
        }

        const validateIdInDatabase = await db("users").where({ id: id })

        if (validateIdInDatabase[0]) {
            res.statusCode = 400
            throw new Error("ID já cadastrado")
        }
       
        const newUser: UserDB = {
            id: id,
            name: name,
            age: age,
            first_semester_grade: firstSemesterGrade,
            second_semester_grade: secondSemesterGrade, 
            teacher_name: teacherName, 
            room_number: roomNumber
        }
        const userDatabase = new UserDatabase()
        await userDatabase.insertUser(newUser)
       

        res.status(201).send("cadastro realizado com sucesso")
    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500).send("Erro inesperado do servidor")
        }
        res.send(error.message)
    }
})


app.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const idUser = req.params.id

        const [user] = await db("users").where({ id: idUser })


        if (!user) {
            res.statusCode = 400
            throw new Error(`Usuario de id: ${idUser} não encontrado`)
        }

        const userDatabase = new UserDatabase()
        await userDatabase.deleteUser(idUser)

        res.status(200).send({ message: "Usuário deletado com sucesso" })
    } catch (error) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500).send({ message: "Erro inesperado no servidor" })
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})



app.put("/users/:id", async (req: Request, res: Response) => {
    try {
        const idUser = req.params.id
        const { newId, newName, newAge, newfirstSemesterGrade, newSecondSemesterGrade, newTeacherName, newRoomNumber } = req.body
       
        if (newId && typeof newId !== "string") {
            res.statusCode = 400
            throw new Error("id precisa ser uma string")
        }
        if (newName && typeof newName !== "string") {
            res.statusCode = 400
            throw new Error("Nome precisa ser uma string")
        }
        if (newAge && typeof newAge !== "string") {
            res.statusCode = 400
            throw new Error("Idade precisa ser uma string")
        }
        if (newfirstSemesterGrade && typeof newfirstSemesterGrade !== "string") {
            res.statusCode = 400
            throw new Error("Nota precisa ser uma string")
        }
        if (newSecondSemesterGrade && typeof newSecondSemesterGrade !== "string") {
            res.statusCode = 400
            throw new Error("Nota precisa ser uma string")
        }
        if (newTeacherName && typeof newTeacherName !== "string") {
            res.statusCode = 400
            throw new Error("Nome precisa ser uma string")
        }
        if (newRoomNumber && typeof newRoomNumber !== "string") {
            res.statusCode = 400
            throw new Error("Sala precisa ser uma string")
        }

        const [userToEdit] = await db("users").where({ id: idUser })

        if (userToEdit) {
            const updateUser:UserDB = {
                id: newId || userToEdit.id,
                name: newName || userToEdit.name,
                age: newAge || userToEdit.age,
                first_semester_grade: newfirstSemesterGrade || userToEdit.first_semester_grade,
                second_semester_grade: newSecondSemesterGrade || userToEdit.second_semester_grade,
                teacher_name: newTeacherName || userToEdit.teacher_name,
                room_number: newRoomNumber || userToEdit.room_number           
            }

            const usersDatabase = new UserDatabase()
            await usersDatabase.editUser(idUser,updateUser)
            // await db("products").update(updateUser).where({ id: idProduct })

        }
        res.status(200).send({ message: `Usuário alterado com sucesso` })

    } catch (error: any) {

        if (res.statusCode === 200) {
            res.status(500).send("Erro inseperado no servidor")
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

