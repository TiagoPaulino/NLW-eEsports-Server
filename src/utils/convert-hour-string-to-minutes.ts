
export function convertHoursStringToMinutes(hoursString :string){
    const [horas, minutos] = hoursString.split(':').map(Number)
    const minutesAmount = (horas * 60) + minutos

    return minutesAmount
}
