import { trimWhiteSpace, executeQuery, displayMessage } from "../helper";
import { createNewArticle, patchArticle, patchTitle, patchOnlyArticle,
     searchArticleByUserandArticleId, deleteArticleById, searchArticleById,
      commentOnArticleById, searchCommentByArticleId, getAllArticle } from "../scripts/Articles";

export const createArticle = async (req, res) => {
    try{
        const request = trimWhiteSpace(req.body)
        const {title, article} = request;
        const {id} = req.user
        await executeQuery(createNewArticle(), [title, article, id])
        displayMessage(res, 201, {
            status:"success",
            data:{
                message:"Article created successfully",
                title,
                article
            }
        })

    }catch(err){
        console.log('some errors encountered', err );
        return displayMessage(res, 500, err)
    }
}

export const updateArticle = async (req, res) => {
    try{
        const articleId = parseInt(req.params.id)
        const request = trimWhiteSpace(req.body)
        const {title, article} = request;
        const {id} = req.user
        const result = await executeQuery(searchArticleByUserandArticleId(), [id, articleId] )
        if(result.rowCount > 0){
            if(title && article){
                await executeQuery(patchArticle(), [title, article, id])
            }
            else if(title && !article){
                await executeQuery(patchTitle(), [title, id])
            }
            else if(!title && article){
                await executeQuery(patchOnlyArticle(), [article, id])
            }
            return displayMessage(res, 201, {
                status:"success",
                data:{
                    message:"Article updated successfully",
                    title,
                    article
                }
            })
        }
        return displayMessage(res,404, {
            message:'Article not found'
        })

    }catch(err){
        console.log('some errors encountered', err );
        return displayMessage(res, 500, err)
    }
}


export const deleteArticle = async (req, res) => {
    try{
        const {id} = req.user
        const articleId = parseInt(req.params.id)
        const result = await executeQuery(searchArticleByUserandArticleId(), [id, articleId] )
        if(result.rowCount > 0){
            await executeQuery(deleteArticleById(), [id, articleId])
            return displayMessage(res, 200, {
                status:"success",
                data:{
                    message:"Article deleted successfully",
                }
            })
        }
        return displayMessage(res, 404, {
            status:"success",
            data:{
                message:"Article not found",
            }
        })

    }catch(err){
        console.log('some errors encountered', err );
        return displayMessage(res, 500, err)
    }
}

export const commentOnArticle = async (req, res) => {
    try{
        const request = trimWhiteSpace(req.body)
        const {comment} = request;
        const {id} = req.user
        const articleId = parseInt(req.params.id)
        const result = await executeQuery(searchArticleById(), [articleId] )
        if(result.rowCount > 0){
            await executeQuery(commentOnArticleById(), [comment, articleId, id])
            return displayMessage(res, 201, {
                status:"success",
                data:{
                    message:"comment posted successfully",
                    comment
                }
            })
        }
        return displayMessage(res, 404, {
            status:"success",
            data:{
                message:"Article not found",
            }
        })

    }catch(err){
        console.log('some errors encountered', err );
        return displayMessage(res, 500, err)
    }
}

export const getArticle = async (req, res) => {
    try{
        const articleId = parseInt(req.params.id)
        const result = await executeQuery('select * from article where id = $1', [articleId] )
        const result2 = await executeQuery(searchCommentByArticleId(), [articleId])
        if(result.rowCount > 0){
            
            return displayMessage(res, 200, {
                status:"success",
                data:{
                    id: result.rows[0].id,
                    article: result.rows[0].article,
                    title: result.rows[0].title,
                    createdOn: result.rows[0].datecreated,
                    comments:[...result2.rows]
                }
            })
        }
        return displayMessage(res, 404,{
            message:'Article not found'
        })
        
    }catch(err){
        console.log('some errors encountered>>', err );
        return displayMessage(res, 500, err)
    }
}


export const getAllArtilce = async (req, res) => {
    try{
        const result = await executeQuery(getAllArticle(),[])
        return displayMessage(res, 200, {
            status:"success",
            data: [...result.rows]
        })
    }catch(err){
        console.log('some errors encountered', err );
        return displayMessage(res, 500, err)
    }
}