import express, { request, response } from "express";
import  cors  from 'cors'
import { PrismaClient } from '@prisma/client'
import { convertHoursStringToMinutes } from "./utils/convert-hour-string-to-minutes";
import { convertMinuteStrintgToHour } from "./utils/convert-minute-string-to-hour-string";


const app = express()

app.use(express.json())
app.use(cors())
const prisma = new PrismaClient()
/* 
Esta começando com banco de dados???
Começe com banco relacional
*/

/* 
* Query: ? Permanecer o estado, para filtros, paginas sempre novameado
* Route: São paramnetos da URL nomeados, identificador, slug 
* Body: Envio de varias informações em uma requisição. ele fica escondido, uso para informações sensiveis
*/

//http methods /API RestFull / http codes

// GET ~ Solicitar, POST ~ Criar uma entidade, PUT ~ Update , PATCH ~ editar algo expecifico, DELETE ~apagar 

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include:{
            _count:{
                select:{
                    ads: true,
                }
            }
        }
    })
    return response.json(games)
})
app.post('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id
        const body: any =  request.body

//validação


    const ad = await prisma.ad.create({
        data:{
                gameId,
                name: body.name,
                yearsPlayng: body.yearsPlayng,
                discord: body.discord,
                weekDays: body.weekDays.join(','),
                hourStart: convertHoursStringToMinutes(body.hourStart),
                hourEnd: convertHoursStringToMinutes(body.hourEnd),
                userVoiceChannel: body.userVoiceChannel
        }
    })    
    return response.status(201).json(ad)
})

app.get('/games/:id/ads', async (request, response)=>{
    const gameId = request.params.id

    const ads = await prisma.ad.findMany({
        select:{
            id: true,
            name: true,
            yearsPlayng: true,
            weekDays: true,
            hourEnd: true,
            hourStart: true,
            userVoiceChannel: true,
        },
        where:{
            gameId,
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    return response.json(ads.map(ad =>{
        return{
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinuteStrintgToHour(ad.hourStart),
            hourEnd: convertMinuteStrintgToHour(ad.hourEnd)
        }
    }))
})
app.get('/ads/:id/discord', async (request, response)=>{
    const adId = request.params.id
    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord:true
        },
        where:{
            id: adId
        }
    })
    return response.json({
        discord: ad.discord
    })
})


app.listen(3333)