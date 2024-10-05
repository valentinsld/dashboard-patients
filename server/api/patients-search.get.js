
import DATA from './data'

export default defineEventHandler((event) => {
    // get query from the event
    const query = getQuery(event)
    const search = query.s

    if (!search) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Requête de recherche invalide'
        })
    }

    // if schema texte is medicalRecordNumber like MR00000
    if (search.startsWith('MR')) {
        const patients = DATA.patients.filter((patient) => patient.medicalRecordNumber.includes(search))

        if (!patients) {
            throw createError({
                statusCode: 404,
                statusMessage: `Patient avec le numéro de dossier médical ${search} n'a pas été trouvé`
            })
        }

        return patients
    } else {
        // if schema texte is firstName lastName like John Doe
        const [firstName, lastName] = search.toLowerCase().split(' ')
        const patients = DATA.patients.filter((patient) => patient.firstName.toLowerCase().includes(firstName) || patient.lastName.toLowerCase().includes(lastName))

        if (!patients) {
            throw createError({
                statusCode: 404,
                statusMessage: `Patient avec le prénom ${firstName} et le nom ${lastName} n'a pas été trouvé`
            })
        }

        return patients
    }
})