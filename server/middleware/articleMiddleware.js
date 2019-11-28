

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
