import DATA from '../data'

export default defineEventHandler((event) => {
    // get the id from the path
    const id = event.context.params.id

    // find the patient with the given id
    const patient = DATA.patients.find((patient) => patient.id == id)

    if (!patient) {
        throw createError({
            statusCode: 404,
            statusMessage: `Patient avec l'id ${id} n'a pas été trouvé`
        })
    }

    return patient
})