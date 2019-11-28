

export const createNewArticle = () => {
    return `insert into article(title, article, userid, datecreated)
            values($1, $2,$3, 'NOW()');`
}