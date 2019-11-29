

export const createNewArticle = () => {
    return `insert into article(title, article, userid, datecreated)
            values($1, $2,$3, 'NOW()');`
}

export const patchArticle = () => {
    return `update article set title = $1, article =$2, updatedAt='NOW()' where id =$3`
}

export const patchTitle = () => {
    return `update article set title = $1, updatedAt='NOW()' where id =$2`
}

export const patchOnlyArticle = () => {
    return `update article set article = $1, updatedAt='NOW()' where id =$2`
}

export const searchArticleByUserandArticleId = () => {
    return `select * from article where id=$1 and userid = $2`
}

export const deleteArticleById = () => {
    return `Delete from article where userid = $1 and id = $2`
}

export const searchArticleById = () => {
    return `select * from article where id = $1`
}

export const getAllArticle = () => {
    return `select * from article`
}

export const commentOnArticleById = () => {
    return `insert into comments(comment, articleid, userid, datecreated)
                values($1,$2,$3, 'NOW()')`
}

export const searchCommentByArticleId = () => {
    return `select * from comments where articleId = $1`
}