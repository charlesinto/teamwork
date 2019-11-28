
export const createUser = () => {
    return `insert into users(firstname, lastname, email, gender,department, jobRole, address, password, datecreated)
            values($1, $2,$3,$4,$5,$6,$7, $8, 'NOW()');`
}