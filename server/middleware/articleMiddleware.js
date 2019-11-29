

export const validateArticle = (req, res, next) => {
    const {title, article} = req.body;
    if(!title || title.trim() === ''){
        return res.status(400).send({
            message:'Title is required'
        })
    }
    if(!article || article.trim() === ''){
        return res.status(400).send({
            message:'Article is required'
        })
    }
    next()
}

export const validateArticleUpdate = (req, res, next) => {
    const {title, article} = req.body;
    if((title && title.trim() !== '') ||(article && article.trim() !== '')){
       return next()
    }
    return res.status(400).send({
        message:'Title and / or  article is required'
    })
}

export const validateComment = (req, res, next) => {
    const {comment} = req.body;
    if((comment && comment.trim() !== '')){
        return next()
    }
    return res.status(400).send({
        message:'comment is required'
    })
}